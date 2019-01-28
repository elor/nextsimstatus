<template>
  <p>
    {{rack.name}}
    <br>
    <rack-temperature :values="rack.temperatures.supply_water" title="supply_water"></rack-temperature>
    <rack-temperature :values="rack.temperatures.supply_air" title="supply_air"></rack-temperature>
    <rack-temperature :values="rack.temperatures.return_air" title="return_air"></rack-temperature>
    <rack-temperature :values="rack.temperatures.return_water" title="return_water"></rack-temperature>
    °C

    {{rack.cooling_capacity}} kW
    @
    {{rack.water_flow}} m³/h
  </p>
</template>

<script>
  import RackTemperature from '@/components/RackTemperature'

  export default {
    components: {
      RackTemperature
    },
    props: {
      rack: Object
    }
  };
</script>