const SimpleStorage = artifacts.require("SimpleStorage");
const CoffeePortal = artifacts.require("CoffeePortal");
const Greeter = artifacts.require("Greeter");

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CoffeePortal);
  deployer.deploy(Greeter, 'Fabien');
};
