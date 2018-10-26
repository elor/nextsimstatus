<template>
  <pie-chart :chart-data="allocData" :hidelegend="hidelegend" :height="height"></pie-chart>
</template>

<script>
import { mapGetters } from "vuex";
import GridCard from "@/components/GridCard";
import PieChart from "@/components/PieChart";
import usercolor from "../utils/usercolor";

function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}

function cpudata(nodes) {
  const allocCPUs = sum(nodes.map(node => Number(node.CPUAlloc)));
  const errCPUs = sum(nodes.map(node => Number(node.CPUErr)));
  const totalCPUs = sum(nodes.map(node => Number(node.CPUTot)));
  const freeCPUs = totalCPUs - allocCPUs - errCPUs;

  return [allocCPUs, freeCPUs, errCPUs];
}

export default {
  props: {
    height: String,
    width: String,
    hidelegend: Boolean
  },
  components: {
    PieChart,
    GridCard
  },
  computed: {
    ...mapGetters(["nodestatus", "userstatus"]),
    allocData() {
      const allocations = cpudata(this.nodestatus);
      const users = this.userstatus
        .filter(user => user.NumCPUs)
        .map(user => ({
          name: user.UserName,
          cpus: user.NumCPUs
        }))
        .sort((a, b) => b.cpus - a.cpus);

      const system = [
        { name: "Free", cpus: allocations[1] },
        { name: "Error", cpus: allocations[2] }
      ].filter(sys => sys.cpus);
      const labels = [
        ...users.map(user => user.name),
        ...system.map(sys => sys.name)
      ];

      return {
        labels: labels,
        datasets: [
          {
            label: "Core Allocations",
            data: [
              ...users.map(user => user.cpus),
              allocations[1],
              allocations[2]
            ],
            backgroundColor: labels.map(usercolor)
          }
        ]
      };
    }
  }
};
</script>
