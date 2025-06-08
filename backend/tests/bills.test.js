const request = require('supertest');
const app = require('../server'); // Sesuaikan path bila file test berada di folder lain

describe('Billing System Integration Test', () => {
  beforeEach(async () => {
    await request(app)
      .post('/__reset')
      .expect(204);
  });

  test('Full flow: login, create customer, create bill, pay, report', async () => {
    // 1. Login
    const loginRes = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '123456' });
    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    // 2. Tambah pelanggan
    const customerRes = await request(app)
      .post('/customers')
      .set('Authorization', token)
      .send({ name: 'Test User', phone: '08123456789' });
    expect(customerRes.status).toBe(201);
    expect(customerRes.body).toHaveProperty('id');

    const customerId = customerRes.body.id;

    // 3. Tambah tagihan
    const billRes = await request(app)
      .post('/bills')
      .set('Authorization', token)
      .send({
        customerId,
        amount: 100000,
        dueDate: '2025-06-30',
      });
    expect(billRes.status).toBe(201);
    expect(billRes.body).toHaveProperty('id');

    const billId = billRes.body.id;

    // 4. Lihat tagihan
    const getBills = await request(app)
      .get('/bills')
      .set('Authorization', token);
    expect(getBills.status).toBe(200);
    expect(getBills.body.length).toBe(1);
    expect(getBills.body[0].customerName).toBe('Test User');

    // 5. Bayar tagihan
    const payBill = await request(app)
      .patch(`/bills/${billId}`)
      .set('Authorization', token);
    expect(payBill.status).toBe(200);
    expect(payBill.body.status).toBe('paid');

    // 6. Lihat laporan
    const report = await request(app)
      .get('/reports')
      .set('Authorization', token);
    expect(report.status).toBe(200);
    expect(report.body.totalPaidAmount).toBe(100000);
    expect(report.body.paidBills).toBe(1);

    // 7. Riwayat pembayaran
    const history = await request(app)
      .get('/payments/history')
      .set('Authorization', token);
    expect(history.status).toBe(200);
    expect(history.body.length).toBe(1);
    expect(history.body[0].customerName).toBe('Test User');
  });
});
