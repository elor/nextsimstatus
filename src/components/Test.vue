<template>
  <v-container fluid>
    <v-card>
      <v-card-text xs-6>
        <v-layout row wrap>
          <grid-card wrap>
            <pie-chart :chart-data="allocData"></pie-chart>
          </grid-card>
          <grid-card wrap>
            <pie-chart :chart-data="nodeData"></pie-chart>
          </grid-card>
          <grid-card wrap>
            <pie-chart :chart-data="userData"></pie-chart>
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import GridCard from "@/components/GridCard";
import PieChart from "@/components/PieChart";
import usercolor from "../utils/usercolor";

const colors = {
  blue: "#03a9f4",
  green: "#4caf50",
  red: "#f44336"
};

function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}

export default {
  components: {
    PieChart,
    GridCard
  },
  computed: {
    ...mapGetters(["nodestatus", "userstatus"]),
    nodeData() {
      return {
        labels: this.nodestatus.map(node => node.NodeName),
        datasets: [
          {
            label: "CPUAlloc",
            data: this.nodestatus.map(node => node.CPUAlloc),
            backgroundColor: this.nodestatus.map(node =>
              usercolor(node.NodeName)
            )
          }
        ]
      };
    },
    userData() {
      return {
        labels: this.userstatus.map(user => user.UserName),
        datasets: [
          {
            label: "Jobs",
            data: this.userstatus.map(user => user.NumCPUs),
            backgroundColor: this.userstatus.map(user =>
              usercolor(user.UserName)
            )
          }
        ]
      };
    },
    allocData() {
      const allocCPUs = sum(this.nodestatus.map(node => Number(node.CPUAlloc)));
      const errCPUs = sum(this.nodestatus.map(node => Number(node.CPUErr)));
      const totalCPUs = sum(this.nodestatus.map(node => Number(node.CPUTot)));
      const freeCPUs = totalCPUs - allocCPUs - errCPUs;

      return {
        labels: ["Alloc", "Free", "Err"],
        datasets: [
          {
            label: "Allocations",
            data: [allocCPUs, freeCPUs, errCPUs],
            backgroundColor: [colors.blue, colors.green, colors.red]
          }
        ]
      };
    }
  }
};
</script>
