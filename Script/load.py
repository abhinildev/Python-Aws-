from locust import HttpUser, task, between
class AttackUser(HttpUser):
    wait_time = between(0.001, 0.01)

    @task(10)
    def hammer_frontend(self):
        self.client.get("/")

    @task(5)
    def hammer_static(self):
        self.client.get("/static/index.css", name="/static")

    @task(5)
    def hammer_heavy(self):
        for i in range(200):
            self.client.get("/", name="/home")
