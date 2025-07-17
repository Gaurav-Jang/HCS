import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  async login(email, password, userType) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        user_type: userType,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  },

  // Signup (patients only)
  async signup(userData) {
    try {
      const response = await api.post("/auth/signup", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem("token");
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Verify token
  async verifyToken() {
    try {
      const response = await api.post("/auth/verify-token");
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false };
    }
  },
};

export const adminService = {
  // Get dashboard stats
  async getDashboard() {
    try {
      const response = await api.get("/admin/dashboard");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch dashboard data",
      };
    }
  },

  // Get all doctors
  async getDoctors() {
    try {
      const response = await api.get("/admin/doctors");
      return { success: true, data: response.data.doctors };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch doctors",
      };
    }
  },

  // Add doctor
  async addDoctor(doctorData) {
    try {
      const response = await api.post("/admin/doctors", doctorData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to add doctor",
      };
    }
  },

  // Approve doctor
  async approveDoctor(doctorId) {
    try {
      const response = await api.put(`/admin/doctors/${doctorId}/approve`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to approve doctor",
      };
    }
  },

  // Get all patients
  async getPatients() {
    try {
      const response = await api.get("/admin/patients");
      return { success: true, data: response.data.patients };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch patients",
      };
    }
  },

  // Get all appointments
  async getAppointments() {
    try {
      const response = await api.get("/admin/appointments");
      return { success: true, data: response.data.appointments };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch appointments",
      };
    }
  },

  // Get all predictions
  async getPredictions() {
    try {
      const response = await api.get("/admin/predictions");
      return { success: true, data: response.data.predictions };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch predictions",
      };
    }
  },
};

export const doctorService = {
  // Get dashboard stats
  async getDashboard() {
    try {
      const response = await api.get("/doctor/dashboard");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch dashboard data",
      };
    }
  },

  // Get appointments
  async getAppointments() {
    try {
      const response = await api.get("/doctor/appointments");
      return { success: true, data: response.data.appointments };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch appointments",
      };
    }
  },

  // Approve appointment
  async approveAppointment(appointmentId, notes = "") {
    try {
      const response = await api.put(
        `/doctor/appointments/${appointmentId}/approve`,
        { notes }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to approve appointment",
      };
    }
  },

  // Reject appointment
  async rejectAppointment(appointmentId, notes = "") {
    try {
      const response = await api.put(
        `/doctor/appointments/${appointmentId}/reject`,
        { notes }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to reject appointment",
      };
    }
  },

  // Complete appointment
  async completeAppointment(appointmentId, notes = "") {
    try {
      const response = await api.put(
        `/doctor/appointments/${appointmentId}/complete`,
        { notes }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to complete appointment",
      };
    }
  },

  // Get predictions
  async getPredictions() {
    try {
      const response = await api.get("/doctor/predictions");
      return { success: true, data: response.data.predictions };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch predictions",
      };
    }
  },

  // Review prediction
  async reviewPrediction(predictionId, doctorNotes, finalDiagnosis) {
    try {
      const response = await api.put(
        `/doctor/predictions/${predictionId}/review`,
        {
          doctor_notes: doctorNotes,
          final_diagnosis: finalDiagnosis,
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to review prediction",
      };
    }
  },
};

export const patientService = {
  // Get dashboard stats
  async getDashboard() {
    try {
      const response = await api.get("/patient/dashboard");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch dashboard data",
      };
    }
  },

  // Get available doctors
  async getDoctors() {
    try {
      const response = await api.get("/patient/doctors");
      return { success: true, data: response.data.doctors };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch doctors",
      };
    }
  },

  // Book appointment
  async bookAppointment(appointmentData) {
    try {
      const response = await api.post("/patient/appointments", appointmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to book appointment",
      };
    }
  },

  // Get appointments
  async getAppointments() {
    try {
      const response = await api.get("/patient/appointments");
      return { success: true, data: response.data.appointments };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch appointments",
      };
    }
  },

  // Cancel appointment
  async cancelAppointment(appointmentId) {
    try {
      const response = await api.put(
        `/patient/appointments/${appointmentId}/cancel`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to cancel appointment",
      };
    }
  },

  // Get predictions
  async getPredictions() {
    try {
      const response = await api.get("/patient/predictions");
      return { success: true, data: response.data.predictions };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch predictions",
      };
    }
  },

  // Get doctor available slots
  async getDoctorAvailableSlots(doctorId, date) {
    try {
      const response = await api.get(
        `/patient/doctors/${doctorId}/available-slots?date=${date}`
      );
      return { success: true, data: response.data.available_slots };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch available slots",
      };
    }
  },
};

export const mlService = {
  // Predict brain tumor
  async predictTumor(formData) {
    try {
      const response = await api.post("/ml/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to process image",
      };
    }
  },

  // Batch predict
  async batchPredict(formData) {
    try {
      const response = await api.post("/ml/batch-predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to process images",
      };
    }
  },

  // Get model info
  async getModelInfo() {
    try {
      const response = await api.get("/ml/model-info");
      return { success: true, data: response.data.model_info };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch model info",
      };
    }
  },

  // Get statistics
  async getStatistics() {
    try {
      const response = await api.get("/ml/statistics");
      return { success: true, data: response.data.statistics };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch statistics",
      };
    }
  },
};

export default api;
