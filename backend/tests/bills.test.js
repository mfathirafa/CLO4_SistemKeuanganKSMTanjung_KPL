const request = require("supertest");
const app = require("../server"); // sesuaikan path jika perlu

describe("Bills API - Integration dan Validation Tests", () => {
  let billId;

  // Test membuat tagihan baru (POST /bills), harus pakai Authorization
  it("should create a new bill", async () => {
    const res = await request(app)
      .post("/bills")
      .set("Authorization", "secret-admin-token") // wajib ada header auth
      .send({
        name: "Budi",
        amount: 100000,
        dueDate: "2025-06-10",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    billId = res.body.id;
  });

  // Test mengambil semua tagihan (GET /bills), tidak perlu auth
  it("should get all bills", async () => {
    const res = await request(app).get("/bills");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test update status tagihan jadi "paid" (PATCH /bills/:id), harus pakai Authorization
  it("should update bill status to paid", async () => {
    const res = await request(app)
      .patch(`/bills/${billId}`)
      .set("Authorization", "secret-admin-token"); // wajib ada header auth

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual("paid");
  });

  // Validation tests

  // Validasi status query yang tidak valid (GET /bills?status=invalid)
  it("should fail if status query is invalid", async () => {
    const res = await request(app).get("/bills?status=invalid");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Validasi nama query yang terlalu pendek (GET /bills?name=ab)
  it("should fail if name query is too short", async () => {
    const res = await request(app).get("/bills?name=ab");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Validasi patch tagihan dengan id bukan angka (PATCH /bills/abc)
  it("should fail to patch bill with non-numeric id", async () => {
    const res = await request(app)
      .patch("/bills/abc")
      .set("Authorization", "secret-admin-token");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // Validasi patch tagihan yang tidak ada (PATCH /bills/9999)
  it("should return 404 if patching non-existent bill", async () => {
    const res = await request(app)
      .patch("/bills/9999")
      .set("Authorization", "secret-admin-token");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  // Validasi patch tagihan yang sudah dibayar (PATCH /bills/:id)
  it("should return 400 if bill already paid", async () => {
    // Buat tagihan baru dulu
    const create = await request(app)
      .post("/bills")
      .set("Authorization", "secret-admin-token")
      .send({
        name: "Test Paid",
        amount: 10000,
        dueDate: "2025-06-10",
      });
    const paidBillId = create.body.id;

    // Bayar tagihan pertama kali
    await request(app)
      .patch(`/bills/${paidBillId}`)
      .set("Authorization", "secret-admin-token");

    // Coba bayar lagi tagihan yang sama (harus error)
    const res = await request(app)
      .patch(`/bills/${paidBillId}`)
      .set("Authorization", "secret-admin-token");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Tagihan sudah dibayar.");
  });
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token", "secret-admin-token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "salah" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should create a new customer", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "Andi Saputra", phone: "081234567890" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Andi Saputra");
  });

  it("should reject customer with invalid phone", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "Asep", phone: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should get list of customers", async () => {
    const res = await request(app).get("/customers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
 