import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
declare var cordova: any;

import { HomeService } from './home.service';

// declare var callback: any
var ed_pk: any
var ed_sk: any
var curve_pk: any
var curve_sk: any

var shit: any


var master_key = '12345678910123456789012345678901'
var encrypted_data = 'jtEN2G/6OAkS592Cnhvo/gnHxp0zZAefJxBRxJhboBc='
var iv = 'KyHIVySrIacdlzTcLuFrjA=='
var data = '{"test": "test"}'
//declare var window: any;
// char hashed_password[crypto_pwhash_scryptsalsa208sha256_STRBYTES];
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	a: string = "fadsf"
  ed_pk: Uint8Array;
  ed_sk: Uint8Array;
  box_pk: Uint8Array;
  box_sk: Uint8Array;
  recp_ed_pk: Uint8Array;
  recp_box_pk: Uint8Array;

  message: string
  show_button_generate_key = true
  show_button_send_pk_to_hp = false
  show_button_store_key = false
  show_button_get_master_key = false
  show_button_get_chain = false


  constructor( private homeService: HomeService, public navCtrl: NavController, private platform: Platform, private storage: Storage) {     
  }

  ngOnInit()
  {  	
       this.platform.ready().then(() => {        
         console.log(window['plugins'])
          window['plugins'].MiniSodium.crypto_sign_keypair(this.callback)
          window['plugins'].MiniSodium.crypto_generichash_blake2b_salt_personal()
          console.log(window['plugins'].MiniSodium)
      });
      this.storage.get('data_storage')
       .then( data =>
       {
         console.log(data,"---")
         if(data)
         {
           this.show_button_generate_key = true
           this.show_button_get_master_key = true
         }
       }
     );      
  }

  testing()
  {
      this.platform.ready().then(() => {        
         console.log(window['plugins'])         
          window['plugins'].MiniSodium.crypto_generichash_blake2b_salt_personal()          
      });
  }

  // sign(data, recipient_pk)
  // {
  //   sodium.crypto_sign_curve25519_to
  // }

  callback(error, result)
  {    
    // console.log(result['pk'],this.ed_pk)
    ed_pk = result['pk']
    ed_sk = result['sk']
  }

  ed_pk_to_curve(error, result)
  {        
    curve_pk = window['plugins'].MiniSodium.to_base64(result)
    console.log(curve_pk)
  }

  ed_sk_to_curve(error, result)
  {
    curve_sk = window['plugins'].MiniSodium.to_base64(result)
    console.log(curve_sk)
  }

  click_button()
  {
    this.platform.ready().then(() => {
         window['plugins'].MiniSodium.crypto_sign_ed25519_pk_to_curve25519(ed_pk,this.ed_pk_to_curve)          
      });
    this.platform.ready().then(() => {        
          window['plugins'].MiniSodium.crypto_sign_ed25519_sk_to_curve25519(ed_sk,this.ed_sk_to_curve)          
      });
    this.message = "Public key and private key is successfully generated"
    this.show_button_generate_key = false
    this.show_button_store_key = true
  }

  store_keys()
  {
    this.storage.set('data_storage', {public_key: curve_pk, private_key: curve_sk});    
    this.show_button_send_pk_to_hp = true
    this.show_button_store_key = false
    this.message = "Public key and private key is successfully stored"

  }

  send_pk_to_hp()
  {

    this.storage.get('data_storage')
       .then( data =>
       {
         this.message = ""
          this.homeService.Send_pk_to_hp({public_key: data['public_key']})
          .subscribe( data =>
          {
            this.show_button_get_master_key = true
            this.show_button_send_pk_to_hp = false
          })
       }
         
     );
       
  }

  get_summary_chain()
  {
     this.storage.get('data_storage')
       .then( data =>
       {        
         this.homeService.Get_all_chain({public_key: data['public_key']})
         .subscribe( data2 =>
         {
          this.storage.set('summary_chain',data2);
          this.message = "Summary chain successfully stored"          
         })
       }
     );
  }

  decrypt_master_key()
  {   
    

    this.storage.get('data_storage')
       .then( data =>
       {               
         console.log(data)
          var message = window['plugins'].MiniSodium.from_string("/BxUwPqGgXbq+SEGNn+gONIlNjia9gm7274+9w7hF58=")
          var encrypted_master_key = window['plugins'].MiniSodium.from_base64(data['encrypted_master_key'])                   
          var hp_public_key = window['plugins'].MiniSodium.from_base64(data['hp_public_key'])
          // var hp_private_key = window['plugins'].MiniSodium.from_base64(data['hp_private_key'])
          var private_key = window['plugins'].MiniSodium.from_base64(data['private_key'])
          var nonce = window['plugins'].MiniSodium.from_base64(data['nonce'])

          console.log(encrypted_master_key)
          console.log(hp_public_key)
          // console.log(private_key)
          console.log(nonce)
          console.log(data)
          window['plugins'].MiniSodium.crypto_box_open_easy(encrypted_master_key,nonce,hp_public_key,private_key,this.callback_decrypt)


           // var message = window['plugins'].MiniSodium.from_string("hello")
           // console.log(message)
           //  var nonce = window['plugins'].MiniSodium.from_base64(data['nonce'])
           //  console.log(data['nonce'])
           //  console.log(nonce)
           //  var public_key = window['plugins'].MiniSodium.from_base64(data['public_key'])
           //  console.log(data['public_key'])
           //  var private_key = window['plugins'].MiniSodium.from_base64(data['private_key'])
           //  console.log(data['private_key'])
           //  window['plugins'].MiniSodium.crypto_box_easy(message,nonce,public_key,private_key,this.callback_decrypt)        
       }
     );



  }

   encrypt_master_key()
  {   
    

    this.storage.get('data_storage')
       .then( data =>
       {        
         // console.log(data['encrypted_master_key'],typeof(encrypted_master_key))
         //  var encrypted_master_key = window['plugins'].MiniSodium.from_base64(data['encrypted_master_key'])
         //  console.log(encrypted_master_key, typeof(encrypted_master_key))
         //  encrypted_master_key = window['plugins'].MiniSodium.to_string(encrypted_master_key)
          // var hp_public_key = window['plugins'].MiniSodium.to_string(window['plugins'].MiniSodium.from_base64(data['hp_public_key']))
          // var private_key = window['plugins'].MiniSodium.to_string(window['plugins'].MiniSodium.from_base64(data['private_key']))
          // var nonce = window['plugins'].MiniSodium.to_string(window['plugins'].MiniSodium.from_base64(data['nonce']))

          // console.log(encrypted_master_key)
          // console.log(hp_public_key)
          // console.log(private_key)
          // console.log(nonce)
          // window['plugins'].MiniSodium.crypto_box_open_easy(encrypted_master_key,nonce,hp_public_key,private_key,this.callback_decrypt)
            var hp_public_key = window['plugins'].MiniSodium.from_base64(data['hp_public_key'])
          var hp_private_key = window['plugins'].MiniSodium.from_base64(data['hp_private_key'])
          
            var nonce = window['plugins'].MiniSodium.from_base64(data['nonce'])            
            var public_key = window['plugins'].MiniSodium.from_base64(data['public_key'])
            var private_key = window['plugins'].MiniSodium.from_base64(data['private_key'])
            shit = 'ExT6HmVaYxcfUlueybJyWZJVNhdPLkIZwznOwGWI9pa3Y+/yc8Z01APwt9H7OA5RGHgEIxcNFEihOcL+x3vwE7ke8DBGPtX4'
            shit = window['plugins'].MiniSodium.from_base64(shit)          
            window['plugins'].MiniSodium.crypto_box_open_easy(shit,nonce,hp_public_key,hp_private_key,this.callback_decrypt2)
       }
     );

       

  }

  get_generate_key()
  {
    this.storage.get('data_storage')
       .then( data =>
       {        
         this.homeService.Get_master_key({public_key: data['public_key']})
         .subscribe( data2 =>
         {
           var new_data: object = data
           new_data['nonce'] = data2['nonce']
           new_data['encrypted_master_key'] = data2['master_key']
           new_data['hp_public_key'] = data2['hp_public_key']           
           console.log(new_data)
           this.storage.set('data_storage',new_data);
           this.message = "Master key is successfully stored" 
           this.show_button_get_chain = true
           this.show_button_get_master_key = false

         })
       }
     );
  }

  callback_decrypt(error, result)
  {
    console.log(error,result)
    shit = result
    console.log(window['plugins'].MiniSodium.to_base64(shit))

  }

  callback_decrypt2(error, result)
  {
    console.log(error,result)
  }

}

