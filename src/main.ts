import './css/index.css';
import JSZip from "jszip";
import {fromEvent} from "rxjs";
import {FOO} from "./Foo";
// import {saveAs} from "file-saver";
console.log('rollup index . ')
const json2ofd = document.querySelector('#json2ofd') as HTMLElement;
console.log('json2ofd is ', json2ofd);
//
fromEvent(json2ofd, 'click').subscribe(async (e: Event) => {
  console.log('json2ofd click . ', e);
  // todo error
  const jsZip = new JSZip();
  console.log('jsZip is ', jsZip);
  // saveAs('aaaaa', 'demo.txt');
});

const openDom = document.querySelector('#open') as HTMLInputElement;
const inputFile = document.querySelector('#ofdFile') as HTMLInputElement;

fromEvent(openDom, 'click').subscribe(() => {
  new FOO().greeting();
  inputFile.click();
});
//
fromEvent(inputFile, 'change').subscribe(async () => {
  // const ext = file?.name.replace(/.+\./, "");
  // const data = JSZip.loadAsync(file, )
  // JSZip.file('demo.text', 'aaaaaa');
  // console.log('JSZip is ', JSZip);
  // saveAs('aaaa', 'demo.txt');
});
