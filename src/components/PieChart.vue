<script>
import { Pie, mixins } from "vue-chartjs";

const config = {};

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, config);
  }
};
</script>
