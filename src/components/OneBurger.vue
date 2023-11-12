<template>
  <div>
    <img v-bind:src="burger.url">
    <h3>{{burger.name}}</h3>
    <span>
      <a id="amountOrdered">
        Amount:
        <button @click="removeBurger">-</button>
        {{ amountOrdered }}
        <button @click="addBurger">+</button>
      </a>
    </span>
    <dl>
      <dt>Ingredients:</dt>
      <dd>
        <ul>
          <li v-for="ingredient in burger.ingredients">
            <span v-if="ingredient === 'Gluten' || ingredient === 'Lactose'" id="bold">
              {{ ingredient }}
            </span>
            <span v-else>
              {{ ingredient }}
            </span>
          </li>
        </ul>
      </dd>
    </dl> 
  </div>
</template>

<script>
export default {
  name: 'OneBurger',
  props: {
    burger: Object
  },
  data() {
    return {
      amountOrdered: 0,
    };
  },
  methods: {
    addBurger() {
      this.amountOrdered++;
      this.$emit("orderedBurger", 
      { name:   this.burger.name,
        amount: this.amountOrdered
      }
      )
    },
    removeBurger() {
      if (this.amountOrdered > 0) {
        this.amountOrdered--;
        this.$emit("orderedBurger", 
      { name:   this.burger.name,
        amount: this.amountOrdered
      }
      )
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
    background-color:darkslategray;
    color: #fff;
    border-radius: 5px;
    padding: 20px;
    font-size: 100%;
    height: 400px;
}
#bold {
    font-weight: bold;
}
dl {
  margin-top: -430px;
}
button {
  margin-top: 340px;
  width: 30px;
  margin-left: 0px;
  margin-right: 0px;
}
#amountOrdered {
  margin-left: 30px;
}
</style>
  