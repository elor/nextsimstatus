<template>
  <pie-chart :chart-data="allocData" :hidelegend="hidelegend" :height="height"></pie-chart>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import PieChart from "@/components/PieChart";
  import usercolor from "../utils/usercolor";

  export default {
    props: {
      height: String,
      width: String,
      hidelegend: Boolean
    },
    components: {
      PieChart
    },
    computed: {
      ...mapGetters(["userstatus"]),
      ...mapState(['usercpus', 'nodecpus']),
      allocData() {
        const system = [
          { name: "Free", cpus: this.nodecpus.free },
          { name: "Error", cpus: this.nodecpus.errored }
        ].filter(sys => sys.cpus);
        const labels = [
          ...this.usercpus.map(user => user.name),
          ...system.map(sys => sys.name)
        ];

        return {
          labels: labels,
          datasets: [
            {
              label: "Core Allocations",
              data: [
                ...this.usercpus.map(user => user.cpus),
                this.nodecpus.free,
                this.nodecpus.errored
              ],
              backgroundColor: labels.map(usercolor)
            }
          ]
        };
      }
    }
  };
</script>