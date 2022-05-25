const mqtt = require('mqtt');
const mysql=require('mysql');

const baglantidb=mysql.createConnection({
    host: 'localhost',
    user: '...',
    password: '...',
    database: 'sensor'
});

baglantidb.connect(function(err)
{
    if(err)
        console.log('Veritabanına bağlanırken bir sorun oluştu'+err);
    else
        console.log('Veritabanina başarıyla bağlanıldı');
});

  const broker = 'yourUrl';
  

  
  const options = {
      clientId: '...',
      username: '...',
      password: '...'
    }
    // topic and message payload:
    let myTopic = 'espresense/devices/ac233f529aa0/xxl89';
  
    let client = mqtt.connect(broker, options);
    client.subscribe(myTopic)


client.on('message', (myTopic, paylaod) => {

    let device=JSON.parse(paylaod.toString())

  // console.log(device.rssi);
  // console.log(device.mac.toString());
  // console.log(device.distance);
  
  console.log(`topic`, myTopic)


    baglantidb.query("SELECT mac FROM sensor", (error, results, fields) => {
       
        if (error) {
             return console.error(error.message);
          }
        let liste = {};
        results.forEach((r, i) => {
            liste =results[i].mac;
        });
        // console.log(liste)
        let data=kontrol(liste,device)
        return data;
})

function kontrol(data,device){

  if(data != device.mac){
    baglantidb.query(`INSERT INTO sensor (rssi,mac,distance) VALUES ('${device.rssi}','${device.mac}',${device.distance})`, function (error,results) {// console log kısmını değiştir

          if (error) {
            return console.error(error.message);
          }
          console.log(results);
            });
  }
  else{
    baglantidb.query(`UPDATE sensor SET rssi =?, distance=? WHERE mac='${device.mac}'`,[device.rssi,device.distance], (error, results, fields) => {
                if (error) {
                  return console.error(error.message);
                }
            
                console.log(results);
         
              });

  }
}




