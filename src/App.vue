<template>
  <div id="app" class="container">
    <input class="input" v-model.trim="value" placeholder="Введите имя" />
    <div v-if="users.length" class="wrapper">
      <div v-for="user in users" :key="user.id" class="wrapper--users">
        <p>{{ user.name }}</p>
        <button @click="selectUsers(user.id)" class="btn-success">
          Добавить
        </button>
      </div>
    </div>
    <div v-else-if="searchBegin" class="wrapper--info">
      <p>Начните поиск пользователей</p>
    </div>
    <div v-else-if="searchFailed">
      <p class="text-danger">Проверьте интернет</p>
    </div>
    <div v-else>
      <p>Пользователи не найдены</p>
    </div>
    <button class="btn--toggle" @click="toggle">
      {{ searchUsers ? "Отключить автопоиск" : "Включить автопоиск" }}
    </button>
    <div class="wrapper" v-if="selectedUsers.length">
      <p>Список добавленных элементов</p>
      <div
        v-for="selectedUser in selectedUsers"
        :key="`s-${selectedUser.id}`"
        class="wrapper--users"
      >
        <p>{{ selectedUser.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api";

export default {
  name: "App",
  components: {},
  data() {
    return {
      value: "",
      users: [],
      selectedUsers: [],
      searchUsers: true,
      failed: false,
      loading: false,
    };
  },
  methods: {
    async search() {
      if (this.value.length <= 2) {
        this.users = [];
        this.failed = false;
        this.loading = false;
        return;
      }
      this.loading = true;
      try {
        this.failed = false;
        const res = await api.getUsers(this.value);
        this.users = [
          ...res.data.suggestions.map((e, index) => {
            return {
              name: e.value,
              id: index,
            };
          }),
        ];
      } catch (e) {
        this.users = [];
        this.failed = true;
      }
      this.loading = false;
    },
    selectUsers(id) {
      if (this.selectedUsers.find((e) => e.id === id)) {
        return;
      }
      this.selectedUsers.push(this.users.find((e) => e.id === id));
    },
    toggle() {
      this.searchUsers = !this.searchUsers;
    },
  },
  computed: {
    searchBegin() {
      return !this.value || this.value.length <= 2 || !this.searchUsers;
    },
    searchFailed() {
      return this.failed || (this.failed && this.value.length <= 2);
    },
  },
  watch: {
    async value() {
      if (this.value.length < 2 || !this.searchUsers) {
        return;
      } else if (!this.value || this.value.length < 2) {
        this.users = [];
        return;
      }
      await this.search();
    },
    searchUsers() {
      if (!this.searchUsers || this.value.length < 2) {
        return;
      }
      this.search();
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 279px;
  /* min-height: 500px; */
  margin: 20px auto;
  padding: 0;
  background: #c4c4c4;
}
.input {
  height: 18px;
  padding: 14px 16px;
  margin-bottom: 24px;
}
.btn--toggle {
  margin-top: auto;
  margin-bottom: 0;
  width: 100%;
  height: 50px;
  border: none;
  background: #7382cd;
}
.btn-success {
  height: 35px;
  width: 104px;
  border: none;
  background: #40b159;
}
.wrapper {
  width: 266px;
  max-height: 300px;
  overflow-y: scroll;
}
.wrapper::-webkit-scrollbar {
  width: 0;
}
.wrapper--users {
  display: flex;
  background: white;
  margin: 1px 13px 3px 1px;
  height: 53px;
  padding: 14px 16px 1px 10px;
  justify-content: space-between;
  align-items: center;
}
.wrapper--info {
  height: 300px;
}
h3 {
  padding: 10px;
}
p {
  margin: 0;
}
</style>
