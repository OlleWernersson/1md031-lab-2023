<template>
  <header>
  <!--    <img src="https://th.bing.com/th/id/OIG.ZE1ZhIyJQfzIPwvPELIW?w=270&h=270&c=6&r=0&o=5&pid=ImgGn" id="hi"> -->
      <h1>Welcome to BurgerOnline</h1>
  </header>
  <main>
      <section class="Burgers">
          <h3>Select burger</h3>
          <p>Here is where you select what burger to order</p>
          <div class="wrapper">
            <Burger v-for="burger in Burgers">
            </Burger>
          </div>
      </section>
      <section id="ci">
          <h3>Customer information</h3>
          <p>Here is where you select your informations so that we can deliver the burger</p>
          <p>
              <label for="firstnamelastname">Full name</label><br>
              <input type="text" id="firstnamelastname" name="fnln" required="required" placeholder="First- and Last name">
          </p>
          <p>
              <label for="email">Email</label><br>
              <input type="email" id="email" name="em" required="required" placeholder="E-mail address">
          </p>
          <p>
              <label for="Streetname">Street</label><br>
              <input type="text" id="streetname" name="sn" required="required" placeholder="Street name">
          </p>
          <p>
              <label for="House">House</label><br>
              <input type="number" id="House" name="h" required="required" placeholder="House number">

          </p>
          <p>
              <label for="paymentmethod">Payment Method</label><br>
              <select id="paymentmethod" name="pm">
                  <option selected="selected">Swish</option>
                  <option>Card</option>
                  <option>Crypto</option>
                  <option>Bank</option>
              </select>
          </p>
          <a>Gender</a><br>
          <form>
              <label>
                  <input type="radio" name="gender" value="male">
                  Male
              </label>
              <br>
              <label>
                  <input type="radio" name="gender" value="female">
                  Female
              </label>
              <br>
              <label>
                  <input type="radio" name="gender" value="nonbinary">
                  Non-Binary
              </label>
          </form>
          <br>
      </section>
      <button type="submit">
          <img src="https://th.bing.com/th/id/OIP.6KI4O9iZJg0ZFOPp4Nn5iQHaHa?w=190&h=190&c=7&r=0&o=5&pid=1.7">
          Place my order!
      </button>
  </main>
  <footer>
  
  </footer>
</template>

<script>
import Burger from '../components/OneBurger.vue'
import io from 'socket.io-client'

const socket = io();

function MenuItem(name, KCal, url, lactose, gluten) {
  this.name = name;
  this.url = url;
  this.Kcal = KCal;
  this.lactose = lactose;
  this.gluten = gluten;
}

let Burgers = [
  new MenuItem("Fire Burger", 3000, "../../public/img/fireburger.jpg", true, true),
  new MenuItem("Green Burger", 3000, "../../public/img/greenburger.jpg", false, false),
  new MenuItem("Hallumi Burger", 1000, "../../public/img/hallumiburger.jpg", true, true)
];

console.log(Burgers); //How to use this??


export default {
  name: 'HomeView',
  components: {
    Burger
  },
  data: function () {
    return {
      burgers: Burgers
    }
  },
  methods: {
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
    font-family: 'Open Sans', sans-serif;
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
#hi { /*Header Image*/
    opacity: 0.6;
    width: 100%;
    height: auto;
    margin-top: -400px;
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
    color: red; /*??*/
    padding: 10px;
}
.box {
    background-color:darkslategray;
    color: #fff;
    border-radius: 5px;
    padding: 20px;
    font-size: 100%;
}
.a {
    /*grid-column: 1;*/
    /*background-image: url("img/fireburger.jpg");*/
}
.b {
    /*grid-column: 2;*/
}
.c {
    /*grid-column:3;
    grid-row:1;*/
}
#gluten {
    font-weight: bold;
}
#lactose {
    font-weight: bold;
}
#ci {
    /*background-color: black;
    color:white;*/
    border: 2px dashed black;
    padding:20px;
    margin-top: 10px;
}
li:contains('Gluten') { /* Hur får man detta att funka?*/
    font-weight: bold;
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
section {
    /*margin-left: 10px;*/
}
select {
    background-color: pink;
}
.VeryGood {
    color: green
}
</style>