module.exports = {
  'getKey': () => {
    let key = null;
    const sayhello = () => {
      console.log(1)
    }
    setInterval(sayhello,3000);
  }
}
