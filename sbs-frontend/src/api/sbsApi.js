import client from './client.js'

export const authApi = {
  login: (payload) => client.post('/auth/login', payload),
  register: (payload) => client.post('/auth/register', payload),
}

export const roomApi = {
  getRooms: () => client.get('/rooms'),
  getRoom: (roomId) => client.get(`/rooms/${roomId}`),
  checkAvailability: (roomId, startTime, endTime) =>
    client.get(`/rooms/${roomId}/availability`, {
      params: { startTime, endTime },
    }),
  createRoom: (payload) => client.post('/rooms', payload),
  updateRoom: (roomId, payload) => client.put(`/rooms/${roomId}`, payload),
  deleteRoom: (roomId) => client.delete(`/rooms/${roomId}`),
}

export const bookingApi = {
  createBooking: (payload) => client.post('/bookings', payload),
  getBookings: () => client.get('/bookings'),
  cancelBooking: (bookingId) => client.delete(`/bookings/${bookingId}`),
  updateStatus: (bookingId, status) =>
    client.patch(`/bookings/${bookingId}/status`, { status }),
}

export const adminApi = {
  getSummary: () => client.get('/admin/reports/summary'),
}
