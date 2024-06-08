const { app, server } = require("../index");
const request = require("supertest");

describe("API TESTING", () => {
  let agent;
  let authToken;
  let taskId;1
  

  beforeAll((done) => {
    agent = request.agent(app);
    done();
  });

  describe("Auth Route Test", () => {
    describe("POST /auth/register", () => {
      describe("Positive Case", () => {
        it("should return object {message:string, data:object} and status 201", async () => {
          const response = await agent.post("/auth/register").send({
            name: "testing",
            email: "testing@mail.com",
            password: "testing",
          });

          expect(response.statusCode).toEqual(201);
          expect(response.body).toEqual({
            message: "user created successfully",
            data: {
              id: expect.any(Number),
              name: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        });
      });

      describe("Negative Case", () => {
        it("should return object {message: 'email already exist'} and status 400", async () => {
          const response = await agent.post("/auth/register").send({
            name: "testing",
            email: "testing@mail.com",
            password: "testing",
          });

          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual({
            message: "email already exist",
          });
        });

        it("should return object {message: 'name, email and password are required'} and status 400", async () => {
          const response = await agent.post("/auth/register").send({
            name: "",
            email: "",
            password: "",
          });

          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual({
            message: "name, email and password are required",
          });
        });

        it("should return object {message: 'Validation error: Validation isEmail on email failed'} and status 400", async () => {
          const response = await agent.post("/auth/register").send({
            name: "testing",
            email: "testing@.com",
            password: "testing",
          });

          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual({
            message: "Validation error: Validation isEmail on email failed",
          });
        });
      });
    });

    describe("POST /auth/login", () => {
      describe("Positive Case", () => {
        it("should return object {message,user}, response cookie with token and status 200", async () => {
          const response = await agent.post("/auth/login").send({
            email: "testing@mail.com",
            password: "testing",
          });

          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            message: "user logged in successfully",
            data: {
              user: {
                name: "testing",
                email: "testing@mail.com",
              },
            },
          });
          expect(response.headers["set-cookie"][0]).toMatch(/jwt=[^;]+/);
        });
      });

      describe("Negative Case", () => {
        it("should return object {message: 'user not found'} and status 404", async () => {
          const response = await agent.post("/auth/login").send({
            email: "testig@mail.com",
            password: "testing",
          });

          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual({
            message: "user not found",
          });
        });

        it("should return object {message: 'password is incorrect'} and status 404", async () => {
          const response = await agent.post("/auth/login").send({
            email: "testing@mail.com",
            password: "testing1",
          });

          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual({
            message: "password is incorrect",
          });
        });

        it("should return object {message: 'email and password are required'} and status 404", async () => {
          const response = await agent.post("/auth/login").send({
            email: "",
            password: "",
          });

          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual({
            message: "email and password are required",
          });
        });
      });
    });

    describe("GET /auth/logout", () => {
      describe("Positive Case", () => {
        it("should logout a user successfully", async () => {
          // First, login to set the cookie
          const loginResponse = await agent.post("/auth/login").send({
            email: "testing@mail.com",
            password: "testing",
          });

          expect(loginResponse.statusCode).toEqual(200);
          const cookie = loginResponse.headers["set-cookie"][0];

          // Then, logout using the same session
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", cookie)
            .expect(200);

          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
          expect(logoutResponse.headers["set-cookie"][0]).not.toMatch(
            /jwt=[^;]+/
          );
        });
      });

      describe("Negative Case", () => {
        it("should handle error when logout fails with 'must login first / token not found'", async () => {
          const response = await agent
            .get("/auth/logout")
            .set("Cookie", null)
            .expect(401);

          expect(response.body).toEqual({
            message: "must login first / token not found",
          });
        });
      });
    });
  });

  describe("User Route Test", () => {
    describe("GET /user", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should return all users", async () => {
          const response = await agent.get("/user").set("Cookie", authToken);
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual(expect.any(Array));
        });
      });

      describe("Negative Case", () => {
        beforeAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);

          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
        });
        it("should handle error when logout fails with 'must login first / token not found'", async () => {
          const response = await agent.get("/user").expect(401);
          expect(response.body).toEqual({
            message: "must login first / token not found",
          });
        });
      });
    });
    describe("GET /user/info", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should return user info", async () => {
          const response = await agent
            .get("/user/info")
            .set("Cookie", authToken);
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual(expect.any(Object));
        });
      });
      describe("Negative Case", () => {
        beforeAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);

          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
        });
        it("should handle error when logout fails with 'must login first / token not found'", async () => {
          const response = await agent.get("/user").expect(401);
          expect(response.body).toEqual({
            message: "must login first / token not found",
          });
        });
      });
    });
    describe("PUT /user/update", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should update a specific user", async () => {
          const response = await agent
            .put("/user/update")
            .send({
              name: "updated name",
              email: "updated@mail.com",
              password: "updated",
            })
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            message: "user updated successfully",
            result: {
              id: expect.any(Number),
              name: "updated name",
              email: "updated@mail.com",
              password: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          });
        });
      });
      describe("Negative Case", () => {
        it("should return object {message: 'name, email and password are required'} and status 404", async () => {
          const response = await agent
            .put("/user/update")
            .send({
              name: "",
              email: "",
              password: "",
            })
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual({
            message: "name, email and password are required",
          });
        });
      });
    });
    describe("DELETE /user/delete", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "updated@mail.com",
          password: "updated",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should delete a specific user", async () => {
          const response = await agent
            .delete("/user/delete")
            .set("Cookie", authToken);
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            message: "user deleted successfully",
            result: expect.any(Number) || expect.any(Object),
          });
        });
      });
      describe("Negative Case", () => {
        beforeAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);
          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
        });
        it("should return object {message: 'must login first / token not found'} and status 401", async () => {
          const response = await agent
            .delete("/user/delete")
            .set("Cookie", authToken);
          expect(response.statusCode).toEqual(401);
          expect(response.body).toEqual({
            message: "must login first / token not found",
          });
        });
      });
    });
    afterAll(async () => {
      const user1 = await agent.post("/auth/register").send({
        name: "testing",
        email: "testing@mail.com",
        password: "testing",
      });

      const user2 = await agent.post("/auth/register").send({
        name: "baru",
        email: "baru@mail.com",
        password: "baru",
      });
    });
  });
    
  describe("Task Route Test", () => {
    beforeAll(async () => {
      const loginResponse = await agent.post("/auth/login").send({
        email: "testing@mail.com",
        password: "testing",
      });
      const cookie = loginResponse.headers["set-cookie"][0];
      authToken = cookie.split(";")[0].split("=")[1];
    });
    describe("POST /task/create", () => {
      describe("Positive Case", () => {
        it("should create a new task", async () => {
          const taskData = {
            title: "New Task",
            description: "Description of the new task",
            status: false,
          };

          const response = await agent
            .post("/task/create")
            .send(taskData)
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(201);
          expect(response.body).toEqual({
            message: "task created successfully",
            result: expect.any(Object),
          });
          taskId = response.body.result.id;
        });
      });

      describe("Negative Case", () => {
        it("should return object {message: 'title, description and status are required'} and status 400", async () => {
          const taskData = {
            title: "",
            description: "",
            status: "",
          };

          const response = await agent
            .post("/task/create")
            .send(taskData)
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(400);
          expect(response.body).toEqual({
            message: "title and description are required",
          });
        });
      });
    });
    describe("GET /task", () => {
      describe("Positive Case", () => {
        it("should return all tasks", async () => {
          const response = await agent.get("/task").set("Cookie", authToken);
          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            result: expect.any(Array),
            message: "success",
          });
        });
      });

      describe("Negative Case", () => {
        beforeAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);
          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
        });
        it("should handle error when logout fails with 'must login first / token not found'", async () => {
          const response = await agent.get("/task").expect(401);
          expect(response.body).toEqual({
            message: "must login first / token not found",
          });
        });
      });
    });
    describe("GET /task/mytask", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should return logged in user's tasks", async () => {
          const response = await agent
            .get("/task/mytask")
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(200);
          expect(response.body.result).toEqual(expect.any(Array));
        });
      });

      describe("Negative Case", () => {
        beforeAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);
          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
          const loginResponse = await agent.post("/auth/login").send({
            email: "baru@mail.com",
            password: "baru",
          });
          const cookie = loginResponse.headers["set-cookie"][0];
          authToken = cookie.split(";")[0].split("=")[1];
        });
        it("should return object {message: 'no tasks found'} and status 404", async () => {
          const response = await agent
            .get("/task/mytask")
            .set("Cookie", authToken);

          expect(response.statusCode).toEqual(404);
          expect(response.body).toEqual({
            message: "no tasks found",
          });
        });

        afterAll(async () => {
          const logoutResponse = await agent
            .get("/auth/logout")
            .set("Cookie", authToken)
            .expect(200);
          expect(logoutResponse.body).toEqual({
            message: "user logged out successfully",
          });
        });
      });
    });

    describe("PUT /task/update/:id", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });

      describe("Positive Case", () => {
        it("should update a specific task", async () => {
          const updateResponse = await agent
            .put(`/task/update/${taskId}`)
            .send({
              title: "Updated Title",
              description: "Updated description",
              status: true,
            })
            .set("Cookie", authToken);

          expect(updateResponse.statusCode).toEqual(200);
          expect(updateResponse.body).toEqual({
            message: "task updated successfully",
            result: expect.any(Object),
          });
        });
      });

      describe("Negative Case", () => {
        it("should return object {message: 'task not found'} and status 404", async () => {
          const updateResponse = await agent
            .put(`/task/update/123456`)
            .send({
              title: "Updated Title",
              description: "Updated description",
              status: true,
            })
            .set("Cookie", authToken);

          expect(updateResponse.statusCode).toEqual(404);
          expect(updateResponse.body).toEqual({
            message: "task not found",
          });
        });
      });

      afterAll(async () => {
        const logoutResponse = await agent
          .get("/auth/logout")
          .set("Cookie", authToken)
          .expect(200);
        expect(logoutResponse.body).toEqual({
          message: "user logged out successfully",
        });
      });
    });

    describe("DELETE /task/delete/:id", () => {
      beforeAll(async () => {
        const loginResponse = await agent.post("/auth/login").send({
          email: "testing@mail.com",
          password: "testing",
        });
        const cookie = loginResponse.headers["set-cookie"][0];
        authToken = cookie.split(";")[0].split("=")[1];
      });
      describe("Positive Case", () => {
        it("should delete a specific task", async () => {
          const deleteResponse = await agent
            .delete(`/task/delete/${taskId}`)
            .set("Cookie", authToken);
          expect(deleteResponse.statusCode).toEqual(200);
          expect(deleteResponse.body).toEqual({
            message: "task deleted successfully",
            result: expect.any(Number),
          });
        });
      });

      describe("Negative Case", () => {
        it("should return object {message: 'task not found'} and status 404", async () => {
          const deleteResponse = await agent
            .delete(`/task/delete/123456`)
            .set("Cookie", authToken);
          expect(deleteResponse.statusCode).toEqual(404);
          expect(deleteResponse.body).toEqual({
            message: "task not found",
          });
        });
      });

      afterAll(async () => {
        const deleteResponse = await agent
          .delete("/user/delete")
          .set("Cookie", authToken);
        expect(deleteResponse.statusCode).toEqual(200);
      });
    });
  });



  afterAll((done) => {
    server.close(() => {
      console.log("Server closed");
      done();
    });
  });
});

console.warn = () => {};