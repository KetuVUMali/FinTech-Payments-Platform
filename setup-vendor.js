// Offline setup: run "npm install" then "node setup-vendor.js". Copies libraries into assets/vendor.
const fs=require('fs'),path=require('path'),out='assets/vendor';
fs.mkdirSync(out,{recursive:true});
const cp=(a,b)=>fs.cpSync(path.join('node_modules',a),path.join(out,b),{recursive:true});
cp('bootstrap/dist/css/bootstrap.min.css','bootstrap.min.css');
cp('bootstrap/dist/js/bootstrap.bundle.min.js','bootstrap.bundle.min.js');
cp('bootstrap-icons/font','bootstrap-icons');
cp('chart.js/dist/chart.umd.js','chart.umd.min.js');
cp('aos/dist/aos.css','aos.css');cp('aos/dist/aos.js','aos.js');
console.log('Vendor files ready in '+out);
