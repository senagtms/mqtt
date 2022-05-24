const mqtt = require('mqtt');
const mysql=require('mysql');

const baglantidb=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e++',
    database: 'sensor'
});

baglantidb.connect(function(err)
{
    if(err)
        console.log('Veritabanına bağlanırken bir sorun oluştu'+err);
    else
        console.log('Veritabanina başarıyla bağlanıldı');
});

  const broker = 'mqtt://192.168.100.40:1883';
  

  
  const options = {
      clientId: 'nodeClient',
      username: 'beacon',
      password: '12345q'
    }
    // topic and message payload:
    let myTopic = 'espresense/devices/ac233f529aa0/xxl89';
  
    let client = mqtt.connect(broker, options);
    client.subscribe(myTopic)


client.on('message', (myTopic, paylaod) => {

    let device=JSON.parse(paylaod.toString())

  console.log(device.rssi);
  console.log(device.mac.toString());
  console.log(device.distance);
  console.log(`topic`, myTopic)


  let sql = `SELECT * FROM sensor`;
  baglantidb.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log(results);
  });  

  if(device.mac.toString() == sql.mac){ 
    baglantidb.query(`UPDATE sensor SET rssi =?, distance=? WHERE mac=?`,function (err, res) { //payload eklenecek
                    if(err) {
                        console.log("error: ", err);
                          result(null, err); 
                       }
                     else{   
                       result(null, res);
                       console.log("güncellendi")
                          }
                      }); }
  else{

    baglantidb.query(`INSERT INTO sensor (id,rssi,mac,distance) VALUES ('${id}','${rssi}','${mac}',${distance})`, function (err, res) {// console log kısmını değiştir
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } 
        console.log("Sensor oluşturuldu ");
         result(null,res);
});
}





})//client.on




// let tarih = Date.now();
// console.log(tarih.toISOString());
