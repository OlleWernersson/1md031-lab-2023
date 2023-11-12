<template>
  <header>
    <h1>Welcome to BurgerOnline</h1>
  </header>
  <main>
    <section class="Burgers">
      <h3>Select burger</h3>
      <p>Here is where you select what burger to order</p>
      <div class="wrapper">
        <Burger v-for="burger in burgers"
          v-bind:burger = "burger"
          v-bind:key="burger.name"
          v-on:orderedBurger="addToOrder($event)"> 
        </Burger>
      </div>
    </section>
    <section id="ci">
      <h3>Customer information</h3>
      <p>Here is where you select your informations so that we can deliver the burger</p>
      <p>
        <label for="firstnamelastname">Full name</label><br>
        <input type="text" id="firstnamelastname" v-model="fullName" required="required" placeholder="First- and Last name">
      </p>
      <p>
        <label for="email">Email</label><br>
        <input type="email" id="email" v-model="Email" required="required" placeholder="E-mail address">
      </p>
      <p>
        <label for="Streetname">Street</label><br>
        <input type="text" id="streetname" v-model="streetName" required="required" placeholder="Street name">
      </p>
      <p>
        <label for="House">House</label><br>
        <input type="number" id="House" v-model="houseNumber" required="required" placeholder="House number">
      </p>
      <p>
        <label for="paymentmethod">Payment Method</label><br>
        <select id="paymentmethod" v-model="paymentMethod">
          <option selected="selected">Swish</option>
          <option>Card</option>
          <option>Crypto</option>
          <option>Bank</option>
        </select>
      </p>
      <a>Gender</a><br>
      <form @submit.prevent="submitForm">
        <label>
          <input type="radio" name="gender" value="male" v-model="selectedGender">
          Male
        </label>
        <br>
        <label>
          <input type="radio" name="gender" value="female" v-model="selectedGender">
          Female
        </label>
        <br>
        <label>
          <input type="radio" name="gender" value="nonbinary" v-model="selectedGender">
          Non-Binary
        </label>
        <br>
        <button type="submit">
          <img src="https://th.bing.com/th/id/OIP.6KI4O9iZJg0ZFOPp4Nn5iQHaHa?w=190&h=190&c=7&r=0&o=5&pid=1.7">
          Place my order!
        </button>
        <a><br>
          Gender: {{ selectedGender }}<br>
          {{ burgers[0].name }}: {{ orderedBurgers[burgers[0].name] }}<br>
          {{ burgers[1].name }}: {{ orderedBurgers[burgers[1].name] }}<br>
          {{ burgers[2].name }}: {{ orderedBurgers[burgers[2].name] }}<br>
          House Number: {{ houseNumber }}<br>
          Payment Method: {{ paymentMethod }}<br>
          Street: {{ streetName }}<br>
          Email: {{ Email }}<br>
          Full Name: {{ fullName }}<br>
        </a>
      </form>
    </section>
  </main>
  <footer>
  
  </footer>
</template>

<script>
import Burger from '../components/OneBurger.vue'
import io from 'socket.io-client'
import menu from '../assets/menu.json'

const socket = io();

function MenuItem(name, KCal, url, lactose, gluten, ingredients) {
  this.name = name;
  this.url = url;
  this.KCal = KCal;
  this.ingredients = ingredients;

  if (gluten) this.ingredients.push("Gluten");
  if (lactose) this.ingredients.push("Lactose");
  this.ingredients.push(KCal + "kCal");
}


let Burgers = [menu[0],menu[1],menu[2]]
/*   new MenuItem("Fire Burger", "3000", "/img/fireburger.jpg", true, true,["Chilli"]),
  new MenuItem("Green Burger", "3000", "/img/greenburger.jpg", false, false,["Avocado","Fake Meat"]),
  new MenuItem("Halloumi Burger", "1000", "/img/halloumiburger.jpg", true, true,[])
] */

export default {
  name: 'HomeView',
  components: {
    Burger
  },
  data: function () {
    return {
      burgers: Burgers,
      selectedGender: null,
      paymentMethod: "Swish",
      houseNumber: null,
      streetName: null,
      Email: null,
      fullName: null,
      Burger: Burger,
      orderedBurgers: {"Fire Burger": 0,"Green Burger": 0,"Halloumi Burger": 0,}
    }
  },
  methods: {
    submitForm() {
      console.log("Selected gender:", this.selectedGender);
    },
    addToOrder($event) {
      this.orderedBurgers[$event.name] = $event.amount;
    },
    getOrderNumber: function () {
      return Math.floor(Math.random()*100000);
    },
    addOrder: function (event) {
      var offset = {x: event.currentTarget.getBoundingClientRect().left,
                    y: event.currentTarget.getBoundingClientRect().top};
      socket.emit("addOrder", { orderId: this.getOrderNumber(),
                                details: { x: event.clientX - 10 - offset.x,
                                           y: event.clientY - 10 - offset.y },
                                orderItems: ["Beans", "Curry"]
                              }
                 );
    }
  }
}
</script>

<style>
@media screen and (max-width: 800px) {
    h1 {
        font-size: 6vw;
    }
}
h1 {
    color:chocolate;
    text-shadow: -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black;
    font-size:40px;
    font-style: italic;
    text-align: center;
    margin-top: 100px;
}
header {
    background-image: url("../../public/img/header.jpg");
    height: 200px;
    overflow: hidden;
}
body {
    font-family: arial;
    font-size: 1.2em;
 }
.Burgers { 
    background-color: black;
    color:white;
    padding:20px;
}
.Burgers div {
    padding-left: 0px;
}
.Burgers div h3 {
    text-align: center;
    margin-top: -250px;
}
.Burgers div img {
    width: 250px;
}
.Burgers div dt {
    margin-top: 250px;
}
.wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: repeat(auto-fill, 450px);
    background-color: black;
}
#ci { /* Customer Information*/
    border: 2px dashed black;
    padding:20px;
    margin-top: 10px;
}
button:hover {
    background-color: greenyellow;
    color:green;
    cursor:pointer
}
button {
    margin-top: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
}
button img {
  width: 20px;
}
select {
    background-color: pink;
}
</style>