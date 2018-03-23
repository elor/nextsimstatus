<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-select :items="groups" item-value="data" v-model="tabledata">
        </v-select>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" label="Filter" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>

      <v-data-table :headers="headers" :items="tabledata" item-key="name" :search="search" hide-actions disable-initial-sort>

        <template slot="items" slot-scope="props">
          <tr @click="props.expanded = !props.expanded">
            <td>{{props.item.name}}</td>
            <td class="text-xs-center">
              <v-progress-linear :value="100 * props.item.usage">
                {{props.item.jobs.length}}/{{props.item.np}}
              </v-progress-linear>
            </td>
            <td>{{props.item.state}}</td>
            <td>{{props.item.properties}}</td>
          </tr>
        </template>

        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          No search results for '{{search}}'.
          <v-btn primary small color="primary" @click="search=''">reset</v-btn>
        </v-alert>

        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>{{props.item.name}}</v-card-text>
          </v-card>
        </template>

        <v-alert slot="no-data" type="error" value="true">
          No items to display
        </v-alert>

      </v-data-table>

    </v-card>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    data() {
      return {
        headers: [
          { text: "Name", value: "name" },
          { text: "Usage", value: "usage" },
          { text: "Status", value: "state" },
          { text: "Queue", value: "properties" }
        ],
        search: "",
        tabledata: this.nodestatus
      };
    },
    computed: {
      ...mapGetters(["nodestatus", "queuestatus"]),

      groups() {
        return [
          {
            text: "Nodes",
            data: this.nodestatus
          },
          {
            text: "Queues",
            data: this.queuestatus
          }];
      }
    },
    created() {
      this.tabledata = this.nodestatus;
    }
  };
</script>

<style scoped>

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
