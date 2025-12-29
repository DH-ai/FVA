/**
 * API Service for connecting frontend to backend
 * Handles all HTTP requests with authentication and encryption
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class APIService {
  private static token: string | null = localStorage.getItem('auth_token');

  /**
   * Set authentication token
   */
  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear authentication token
   */
  static clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Get current token
   */
  static getToken(): string | null {
    return this.token;
  }

  /**
   * Make API request with proper headers
   */
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    console.group(`%c API %c ${options.method || 'GET'} ${endpoint}`, 
      'background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px;',
      'color: #60a5fa;'
    );
    console.log('Request:', options.body ? JSON.parse(options.body as string) : null);
    console.groupEnd();

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      console.group(`%c ${response.status} %c ${endpoint}`,
        response.ok 
          ? 'background: #16a34a; color: white; padding: 2px 8px; border-radius: 4px;'
          : 'background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px;',
        'color: #60a5fa;'
      );
      console.log('Response:', data);
      console.groupEnd();

      if (!response.ok) {
        throw new APIError(data.message || 'Request failed', response.status, data.error);
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) throw error;
      console.error('API Error:', error);
      throw new APIError('Network error', 0, 'NETWORK_ERROR');
    }
  }

  // =====================
  // AUTH ENDPOINTS
  // =====================

  static async login(username: string, password: string) {
    const response = await this.request<{
      success: boolean;
      user: { id: string; username: string; role: string };
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  static async logout() {
    const response = await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
    return response;
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  // =====================
  // VOTER ENDPOINTS
  // =====================

  static async verifyVoter(data: {
    aadharNumber?: string;
    panNumber?: string;
    voterIdNumber?: string;
  }) {
    return this.request<{
      success: boolean;
      voter: {
        id: string;
        maskedAadhar: string;
        constituency: string;
        boothNumber: string;
        eligibilityStatus: string;
      };
    }>('/voter/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getVoter(voterId: string) {
    return this.request(`/voter/${voterId}`);
  }

  static async getVoterStatus(voterId: string) {
    return this.request(`/voter/${voterId}/status`);
  }

  // =====================
  // OTP ENDPOINTS
  // =====================

  static async sendOTP(phoneNumber: string, voterId?: string) {
    return this.request<{
      success: boolean;
      message: string;
      expiresIn: number;
      demoOtp?: string;
    }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, voterId }),
    });
  }

  static async verifyOTP(phoneNumber: string, otp: string, voterId?: string) {
    return this.request<{
      success: boolean;
      sessionToken: string;
    }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp, voterId }),
    });
  }

  // =====================
  // BIOMETRIC ENDPOINTS
  // =====================

  static async initCamera(voterId: string) {
    return this.request('/biometric/init-camera', {
      method: 'POST',
      body: JSON.stringify({ voterId, deviceType: 'webcam', resolution: '1280x720' }),
    });
  }

  static async submitFaceScan(voterId: string, scanData?: string) {
    return this.request<{
      success: boolean;
      faceId: string;
      matchScore: number;
      confidence: string;
    }>('/biometric/face-scan', {
      method: 'POST',
      body: JSON.stringify({ voterId, scanData, timestamp: new Date().toISOString() }),
    });
  }

  static async submitRetinaScan(voterId: string, eyePosition: string = 'LEFT') {
    return this.request<{
      success: boolean;
      retinaId: string;
      matchScore: number;
      confidence: string;
    }>('/biometric/retina-scan', {
      method: 'POST',
      body: JSON.stringify({ voterId, eyePosition }),
    });
  }

  static async checkPrivacy(voterId: string) {
    return this.request<{
      success: boolean;
      personsDetected: number;
      isAlone: boolean;
      confidenceScore: number;
    }>('/biometric/privacy-check', {
      method: 'POST',
      body: JSON.stringify({ voterId }),
    });
  }

  static async getBiometricStatus(voterId: string) {
    return this.request(`/biometric/status/${voterId}`);
  }

  // =====================
  // VOTING ENDPOINTS
  // =====================

  static async getCandidates() {
    return this.request<{
      success: boolean;
      candidates: Array<{
        id: string;
        name: string;
        party: string;
        symbol: string;
      }>;
    }>('/voting/candidates');
  }

  static async castVote(voterId: string, candidateId: string) {
    return this.request<{
      success: boolean;
      voteId: string;
      status: string;
    }>('/voting/cast', {
      method: 'POST',
      body: JSON.stringify({ voterId, candidateId }),
    });
  }

  static async confirmVote(voteId: string, voterId: string) {
    return this.request<{
      success: boolean;
      voteId: string;
      blockchainHash: string;
      blockNumber: number;
      status: string;
    }>('/voting/confirm', {
      method: 'POST',
      body: JSON.stringify({ voteId, voterId }),
    });
  }

  static async getReceipt(voteId: string) {
    return this.request(`/voting/receipt/${voteId}`);
  }

  static async verifyVote(blockchainHash: string) {
    return this.request(`/voting/verify/${blockchainHash}`);
  }

  // =====================
  // ELECTION ENDPOINTS
  // =====================

  static async getCurrentElection() {
    return this.request('/election/current');
  }

  static async getElectionResults() {
    return this.request<{
      success: boolean;
      results: Array<{
        rank: number;
        candidateId: string;
        candidateName: string;
        party: string;
        voteCount: number;
        percentage: number;
      }>;
      summary: {
        totalVotes: number;
        winner: {
          candidateName: string;
          party: string;
          voteCount: number;
          percentage: number;
        } | null;
      };
    }>('/election/results');
  }

  static async getElectionWinner() {
    return this.request<{
      success: boolean;
      hasWinner: boolean;
      winner?: {
        name: string;
        party: string;
        voteCount: number;
        percentage: number;
        marginOfVictory: number;
      };
    }>('/election/winner');
  }

  static async getElectionStats() {
    return this.request('/election/stats');
  }

  // =====================
  // ADMIN ENDPOINTS
  // =====================

  static async getDuplicateVoters(threshold: number = 0.7, severity?: string) {
    const params = new URLSearchParams({ threshold: threshold.toString() });
    if (severity) params.append('severity', severity);
    return this.request<{
      success: boolean;
      totalVoters: number;
      duplicatesFound: number;
      bySeverity: {
        critical: number;
        high: number;
        medium: number;
        low: number;
      };
      duplicates: Array<{
        voter1: { id: string; name: string };
        voter2: { id: string; name: string };
        confidence: number;
        severity: string;
        matchedFields: string[];
      }>;
    }>(`/admin/duplicates?${params}`);
  }

  static async checkVoterDuplicates(voterId: string) {
    return this.request(`/admin/duplicates/${voterId}`);
  }

  static async resolveDuplicate(voter1Id: string, voter2Id: string, resolution: string, notes?: string) {
    return this.request('/admin/duplicates/resolve', {
      method: 'POST',
      body: JSON.stringify({ voter1Id, voter2Id, resolution, notes }),
    });
  }

  static async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  static async getAllVoters(page: number = 1, limit: number = 50, filters?: { hasVoted?: boolean; search?: string }) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters?.hasVoted !== undefined) params.append('hasVoted', filters.hasVoted.toString());
    if (filters?.search) params.append('search', filters.search);
    return this.request(`/admin/voters?${params}`);
  }

  static async getAuditLogs(page: number = 1, limit: number = 100, action?: string) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (action) params.append('action', action);
    return this.request(`/admin/audit-logs?${params}`);
  }

  // =====================
  // HEALTH CHECK
  // =====================

  static async healthCheck() {
    return this.request('/health');
  }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export { APIService, APIError };
export default APIService;
