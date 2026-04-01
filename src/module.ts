import "./common-module";
import "./region-utils";
import "./hide-unidentify";
//import "./url-fix"; apenas na necessidade de corrigir
import "./dialog-utils";
import "./hero-points"
import "./sockets/socket-factory"
import { injectController } from "taulukko-commons";

injectController.registerByName("HelloWorld", "Hello World");

console.log(injectController.resolve("HelloWorld") + " InjectController");