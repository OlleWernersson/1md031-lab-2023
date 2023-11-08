<template>
  <div class="box a">
    <img v-bind:src="burger.img">
    <h3>{{burger.name}}</h3>
    <dl>
        <dt>Ingredients:</dt>
        <dd>
            <ul>
              <li v-for="ingredient in burger.ingredients"></li>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
  