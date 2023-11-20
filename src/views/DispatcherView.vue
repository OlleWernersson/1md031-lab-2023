<template>
  <div id="orders">
    <div id="orderList" v-if="showOrderList">
      <div v-for="(order, key) in orders" :key="'order'+key" class="order-container">
        <span class="order-info">#{{ order.orderId }}:</span>
        <div v-for="(item, index) in order.orderItems" :key="'item' + index" class="order-item">
          {{ item.name }}: {{ item.quantity }}
        </div>
        <button class="order-status" @click="updateCurrentStatus(order.orderId)">{{order.status}}</button>
        <div class="personal-info">
          {{ order.personalInfo.fullName }},
          {{ order.personalInfo.email }},
          {{ order.personalInfo.gender }},
          {{ order.personalInfo.paymentMethod }}
        </div>
      </div>
      <button v-on:click="clearQueue" class="clear-orders-button">Clear Orders</button>
    </div>
    <div class="map" v-bind:style="{ background: 'url(' + require('../../public/img/polacks.jpg')+ ')' }">
    </div>
    <div v-for="(order, key) in orders">
      <a id="orderKey"
      v-bind:style="{ left: order.details.x-65 + 'px', top: order.details.y-10 + 'px'}"
      >
      {{ key }}
      </a>
      <div class="dots"
      v-bind:key="'dots' + key"
      v-bind:style="{ left: order.details.x-10 + 'px', top: order.details.y-10 + 'px', background: getDotColor(order) }"
      @click="showOrderDetails(order)"
      >
      </div>
      
    </div>
    <div v-if="selectedOrder" 
    class="orderDetails"
    v-bind:style="{ left: selectedOrder.details.x+10 + 'px', top: selectedOrder.details.y-10 + 'px' }"
    >
      <!-- Display order details -->
      <div class="order-container">
        <span class="order-info">#{{ selectedOrder.orderId }}:</span>
        <div v-for="(item, index) in selectedOrder.orderItems" :key="'item' + index" class="order-item">
          {{ item.name }}: {{ item.quantity }}
        </div>
        <button class="order-status" @click="updateCurrentStatus(selectedOrder.orderId)">
          {{ selectedOrder.status }}
        </button>
        <div class="personal-info">
          {{ selectedOrder.personalInfo.fullName }},
          {{ selectedOrder.personalInfo.email }},
          {{ selectedOrder.personalInfo.gender }},
          {{ selectedOrder.personalInfo.paymentMethod }}
        </div>
      </div>
    </div>
    <button @click="toggleOrderList">Toggle Order List</button>

  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io();

export default {
  name: 'DispatcherView',
  data: function () {
    return {
      orders: null,
      showOrderList: true,
      selectedOrder: null,
    }
  },
  created: function () {
    socket.on('currentQueue', data =>
      this.orders = data.orders);
  },
  methods: {
    clearQueue: function () {
      socket.emit('clearQueue');
    },
    updateCurrentStatus(orderKey) {
      // Find the order based on the key (ex key = #96050)
      let order = this.orders[orderKey];

      // Update the status for the clicked order
      if (order.status === "On the Way!") {
        order.status = "Delivered";
        socket.emit('updateOrder', order);
      }
      if (order.status === "Preparation") {
        order.status = "On the Way!";
        socket.emit('updateOrder', order);
      }
      if (order.status === "New Order") {
        order.status = "Preparation";
        socket.emit('updateOrder', order);
      }
    },
    getDotColor(order) {
      const fullName = order.personalInfo.fullName.toLowerCase();

      if (fullName.includes('john')) {
        return 'blue';
      } else if (fullName.includes('mary')) {
        return 'pink';
      } else {
        return 'black'; // Default color
      }
    },
    toggleOrderList() {
      this.showOrderList = !this.showOrderList;
    },
    showOrderDetails(order) {
      // Set the selectedOrder when a dot is clicked
      if (order === this.selectedOrder) {
        this.selectedOrder = null;
      }
      else {
        this.selectedOrder = order;
      }
    },
  }
}
</script>

<style scoped>
#orderList {
  top:1em;
  left:1em;
  position: absolute;
  z-index: 2;
  color:black;
  background: rgba(255,255,255, 0.5);
  padding: 1em;
  z-index: 4;
}
.orderDetails {
  position:absolute;
  background: rgba(255,255,255, 1);
  z-index: 4;
  border-color: gold;
  border-style: double;
}

.map {
  position: relative;
  margin: 0;
  padding: 0;
  background-repeat: no-repeat;
  width:1920px;
  height: 1078px;
  cursor: crosshair;
  z-index: 1;
}
.order-container {
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid darkgrey; /* Add this line for the border */
}

.order-info {
  margin-right: 10px;
}

.order-item {
  display: inline;
  margin-right: 10px;
}

.personal-info {
  font-style: italic;
}

.order-status {
  margin-left: auto;
  margin-top: -20px;
  margin-bottom: 0px;
}

.clear-orders-button {
  margin-top: 10px;
}
.dots{
  position: absolute;
  color: black;
  border-radius: 10px;
  width:20px;
  height:20px;
  z-index: 3;
  cursor:pointer;
}
#orderKey {
  position:absolute;
  margin-right:65px; 
  background: rgba(255, 192, 200, 0.8);
  height: 20px;
  width: 70px;
  z-index: 2;
}
</style>
