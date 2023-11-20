<template>
  <div id="orders">
    <div id="orderList">
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
    <div id="dots" v-bind:style="{ background: 'url(' + require('../../public/img/polacks.jpg')+ ')' }">
      <div v-for="(order, key) in orders" v-bind:style="{ left: order.details.x + 'px', top: order.details.y + 'px'}" v-bind:key="'dots' + key">
        {{ key }}
      </div>
    </div>
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
    }
  }
}
</script>

<style>
#orderList {
  top:1em;
  left:1em;
  position: absolute;
  z-index: 2;
  color:black;
  background: rgba(255,255,255, 0.5);
  padding: 1em;
}

#dots {
  position: relative;
  margin: 0;
  padding: 0;
  background-repeat: no-repeat;
  width:1920px;
  height: 1078px;
  cursor: crosshair;
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
#dots div {
  position: absolute;
  background: black;
  color: chocolate;
  font-weight: bold;
  border-radius: 10px;
  width:20px;
  height:20px;
  text-align: center;
}
</style>
