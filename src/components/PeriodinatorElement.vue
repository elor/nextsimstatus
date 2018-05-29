<template>
    <span class="element" :class="`color-${color}`">
        <span class="symbol">{{element.symbol}}</span>
        <span class="name">{{element.name}}</span>
        <span class="number">{{element.number}}</span>
        <span class="mass">{{element.mass}}</span>
    </span>
</template>

<script>
import { elements } from "../utils/elements";

export default {
  props: ["symbol", "color"],
  computed: {
    element() {
      return (
        elements[this.symbol] || {
          symbol: this.symbol,
          mass: "",
          name: "",
          number: ""
        }
      );
    }
  }
};
</script>

<style scoped>
.element {
  background-color: lightgrey;
  border: 1px solid black;
  display: inline-block;
  font-family: sans-serif;
  text-align: left;
  height: 54pt;
  margin: 2pt;
  position: relative;
  width: 48pt;
}

.element.color-0 {
  background-color: hsl(60, 100%, 50%);
}
.element.color-1 {
  background-color: hsl(30, 100%, 50%);
}
.element.color-2 {
  background-color: hsl(0, 100%, 50%);
}
.element.color-3 {
  background-color: hsl(300, 100%, 50%);
}
.element.color-4 {
  background-color: hsl(270, 100%, 60%);
}
.element.color-5 {
  background-color: hsl(200, 100%, 50%);
}
.element.color-6 {
  background-color: hsl(170, 100%, 50%);
}
.element.color-7 {
  background-color: hsl(120, 100%, 50%);
}

.element.color-error {
  background-color: hsl(0, 100%, 50%);
}

.element .symbol {
  bottom: 10pt;
  font-size: 24pt;
  font-weight: bold;
  position: absolute;
  top: 8pt;
  text-align: center;
  width: 100%;
}

.element .name {
  bottom: 0pt;
  font-size: 8pt;
  position: absolute;
  text-align: center;
  width: 100%;
}

.element .number {
  font-size: 10pt;
  font-weight: bold;
  position: absolute;
  right: 2pt;
  top: 0pt;
}
.element .mass {
  font-size: 8pt;
  left: 1pt;
  position: absolute;
  top: 1pt;
}
</style>
