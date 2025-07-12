const API_BASE_URL = "https://redtestlab.com/api/doctor"

export interface Hospital {
  id: number
  name: string
  images: string[]
  address: string
  city: string
  state: string
  pincode: string
  departments: string[]
  facilities: string[]
  contactEmail?: string
  contactPhone?: string
  availableDays: string[]
  fromTime: string
  toTime: string
  feeRangeMin: number
  feeRangeMax: number
  commission: number
  isScanProvider: boolean
  treatmentTags: string[]
  createdAt: string
  updatedAt: string
  doctors?: Doctor[]
  consultations?: Consultation[]
}

export interface Doctor {
  id: number
  name: string
  imageUrl: string
  gender: string
  experienceYears: number
  qualifications: string
  specialization: string
  languagesSpoken: string[]
  affiliatedHospitalId: number
  consultationFee: number
  availableDays: string[]
  fromTime: string
  toTime: string
  contactPhone?: string
  contactEmail?: string
  commission: number
  treatmentTags: string[]
  createdAt: string
  updatedAt: string
  affiliatedHospital?: Hospital
  consultations?: Consultation[]
}

export interface Consultation {
  id: number
  userId: number
  doctorId: number
  hospitalId: number
  patientName: string
  email: string
  phoneNumber: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  amountPaid: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  showContactInfo: boolean
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  hospital?: Hospital
}

export interface PaymentResponse {
  success: boolean
  razorpayOrderId: string
  consultationId: number
  amount: number
  currency: string
}

export interface OTPSendResponse {
  success: boolean
  message: string
}

export interface OTPVerifyResponse {
  success: boolean
  message: string
  verified: boolean
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Hospital APIs
  async getHospitals(): Promise<Hospital[]> {
    return this.request<Hospital[]>("/hospitals")
  }

  async getHospital(id: number): Promise<Hospital> {
    return this.request<Hospital>(`/hospitals/${id}`)
  }

  async createHospital(hospital: Omit<Hospital, "id" | "createdAt" | "updatedAt">): Promise<Hospital> {
    return this.request<Hospital>("/hospitals", {
      method: "POST",
      body: JSON.stringify(hospital),
    })
  }

  async updateHospital(id: number, hospital: Partial<Hospital>): Promise<Hospital> {
    return this.request<Hospital>(`/hospitals/${id}`, {
      method: "PUT",
      body: JSON.stringify(hospital),
    })
  }

  async deleteHospital(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/hospitals/${id}`, {
      method: "DELETE",
    })
  }

  // Doctor APIs
  async getDoctors(): Promise<Doctor[]> {
    return this.request<Doctor[]>("/doctors")
  }

  async getDoctor(id: number): Promise<Doctor> {
    return this.request<Doctor>(`/doctors/${id}`)
  }

  async createDoctor(doctor: Omit<Doctor, "id" | "createdAt" | "updatedAt">): Promise<Doctor> {
    return this.request<Doctor>("/doctors", {
      method: "POST",
      body: JSON.stringify(doctor),
    })
  }

  async updateDoctor(id: number, doctor: Partial<Doctor>): Promise<Doctor> {
    return this.request<Doctor>(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(doctor),
    })
  }

  async deleteDoctor(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/doctors/${id}`, {
      method: "DELETE",
    })
  }

  // Consultation APIs
  async getConsultations(): Promise<Consultation[]> {
    return this.request<Consultation[]>("/consultations")
  }

  async createPayment(paymentData: {
    userId: number
    doctorId: number
    hospitalId: number
    patientName: string
    email: string
    phoneNumber: string
    appointmentDate: string
    appointmentTime: string
    reason: string
    amountPaid: number
  }): Promise<PaymentResponse> {
    return this.request<PaymentResponse>("/create-payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
  }

  async verifyPayment(verificationData: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
    consultationId: number
  }): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>("/verify-payment", {
      method: "POST",
      body: JSON.stringify(verificationData),
    })
  }

  // OTP APIs
  async sendOTP(data: {
    userId: number
    phoneNumber: string
  }): Promise<OTPSendResponse> {
    return this.request<OTPSendResponse>("/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyOTP(data: {
    userId: number
    phoneNumber: string
    otp: string
  }): Promise<OTPVerifyResponse> {
    return this.request<OTPVerifyResponse>("/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
