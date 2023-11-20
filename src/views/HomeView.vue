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
        Please indicate point of delivery:
        <div id="map" v-on:click="setLocation" ref="map">
          <img src="../../public/img/polacks.jpg">
          <div ref="dot" class="dot"><a id="Target">T</a></div>
        </div>
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
      </form>
    </section>
    <div class="placingOrder">
      <button type="submit" v-on:click="tryToOrder">
        <img src="https://th.bing.com/th/id/OIP.6KI4O9iZJg0ZFOPp4Nn5iQHaHa?w=190&h=190&c=7&r=0&o=5&pid=1.7">
        Place my order!
      </button>
      <a id="orderMessage"></a>
    </div>
    <a id="receipt" v-if="showReceipt"><br>
      Your Receipt:
      <a v-for="(quantity, burger) in orderedBurgers">
        <p v-if="quantity > 0" style="margin:0px">{{ burger }}: {{ quantity }}</p>
      </a>
      Full Name: {{ fullName }}<br>
      Email: {{ Email }}<br>
      Payment Method: {{ paymentMethod }}<br>
      Gender: {{ selectedGender }}<br>
      Order Status: {{ orders[orderId].status }}
    </a>


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
      Email: null,
      fullName: null,
      Burger: Burger,
      orderedBurgers: {"Fire Burger": 0,"Green Burger": 0,"Halloumi Burger": 0},
      location: { x: 0,
                  y: 0
                },
      dotSize: 20,
      showReceipt: false, /*A big problem is that the receipt can change after it's been made*/
      orderId:0,
      orders: null,
    }
  },
  created: function () {
    socket.on('allOrders', data =>
      this.orders = data.orders);
  },
  methods: {
    tryToOrder() {
      let orderInfoMissing = false;
      let sum = 0;
      if (this.selectedGender === null || this.Email === null || this.fullName === null
      || this.selectedGender === "" || this.Email === "" || this.fullName === "") {
        orderInfoMissing = true;
      }
      if (this.location.x === 0 && this.location.y === 0) {
        orderInfoMissing = true;
      }
      for (let key in this.orderedBurgers) {
        sum += this.orderedBurgers[key]
      }
      if (sum === 0) {
        orderInfoMissing = true;
      }
      this.displayWhatIsMissing()
      if (!orderInfoMissing){
        this.submitForm()
        this.showReceipt = true;
      }
      
    },
    displayWhatIsMissing() {
      let missingInfo = [];

      if (this.selectedGender === null || this.selectedGender === "") {
        missingInfo.push("Gender");
      }
      if (this.Email === null || this.Email === "") {
        missingInfo.push("Email");
      }
      if (this.fullName === null || this.fullName === "") {
        missingInfo.push("Full Name");
      }
      if (this.location.x === 0 && this.location.y === 0) {
        missingInfo.push("Delivery Location");
      }
      let sum = 0;
      for (let key in this.orderedBurgers) {
        sum += this.orderedBurgers[key];
      }
      if (sum === 0) {
        missingInfo.push("Burgers");
      }

      const targetElement = document.getElementById("orderMessage");
      if (targetElement) {
        console.log(missingInfo)
        if (missingInfo.length > 0) {
          targetElement.textContent = "Order not Sent! Pleace Select: " + missingInfo.join(", ");
          targetElement.style.color = "red"
        } else {
          targetElement.textContent = "Order Sent!";
          targetElement.style.color = "green"
        }
      }
    },
    submitForm() {
      let orderDetails = {
        orderId: this.getOrderNumber(),
        details: {
          x: this.location.x,
          y: this.location.y,
        },
        orderItems: Object.keys(this.orderedBurgers)
        .filter((burger) => this.orderedBurgers[burger] > 0)
        .map((burger) => ({ name: burger, quantity: this.orderedBurgers[burger] })),
        personalInfo: {
          fullName: this.fullName,
          email: this.Email,
          gender: this.selectedGender,
          paymentMethod: this.paymentMethod
        },
        status: "New Order"
      };

      socket.emit("addOrder", orderDetails);
    },
    addToOrder($event) {
      this.orderedBurgers[$event.name] = $event.amount;
    },
    getOrderNumber: function () {
      this.orderId = Math.floor(Math.random()*100000);
      return this.orderId;
    },
    setLocation(event) {
      const mapRect = this.$refs.map.getBoundingClientRect();
      this.location = {
        x: event.clientX + this.$refs.map.scrollLeft - mapRect.left,
        y: event.clientY + this.$refs.map.scrollTop - mapRect.top,
      };
      this.updateDotPosition();
    },
    updateDotPosition() {
      const dot = this.$refs.dot;
      if (dot) {
        dot.style.left = this.location.x - this.dotSize / 2 + "px";
        dot.style.top = this.location.y - this.dotSize / 2 + "px";
      }
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
/*     background-repeat:no-repeat;
    background-size: 100% 100%; */
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
#map {
  position: relative;
  overflow: scroll;
  height: 500px;
  width: 100%;
}
.dot {
  position: absolute;
  width: 20px; 
  height: 20px; 
  background-color: black;
  border-radius: 50%;
}
#Target {
  color:white;
  margin-left: 4px;
}
.placingOrder {
  display: inline;
}
</style>