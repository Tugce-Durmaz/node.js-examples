 
const fs = require ('fs');// dosya işlemleri için require ettim
// const util = require('util');
// const stream = require('stream');
const zlib = require('zlib'); // compress etmek için require ettim.
const { pipeline } = require('stream');
const { promisify } = require('util');
const pipelineAsync = promisify(pipeline);


   async function runBrotli()   {
    

    try { 
        console.time('BROTLI COMPRESS TIME'); // timer başlangıcı 

        await pipelineAsync (
         fs.createReadStream('data.hex'),// deneme.hex i okumasını sağlıyorum 
         zlib.createBrotliCompress(), // Dosyayı brotli haline compress ediyorum
         fs.createWriteStream('data.brotli'),// dosyanın brotli halini oluşturuyorum.
        // awaite promis dışında bir şey atarsak pas geçecek. bu yüzden promis olarak tanımlamamız lazım.
        );
    console.timeEnd('BROTLI COMPRESS TIME'); // timer ı sonlandırdım 
    console.log('BROTLI COMPRESS SIZE:', fs.statSync('data.brotli').size); // fs.stat ile deneme.brotli için size bilgisi aldım
// file.stat senkron olmazsa yanıt alınmıyor
           
   
    // Aynı şeyleri decompress için yapıyorum.
          console.time('BROTLI DECOMPRESS TIME'); 
     await pipelineAsync (
        fs.createReadStream('data.brotli'),
        zlib.createBrotliDecompress(),
        fs.createWriteStream('data2.hex'),
    );

         console.timeEnd('BROTLI DECOMPRESS TIME');
     console.log('BROTLI DECOMPRESS SIZE:', fs.statSync('data2.hex').size);
    
    } catch (err) {
        console.error('failed' , err);
    }
}

      async function runGzip() {
        
        // aynı şekilde gzip için oluşturuyorum.
    console.time('GZIP COMPRESS TIME');
    try { 
        await pipelineAsync(
            fs.createReadStream('data.hex'),
             zlib.createGzip(),
            fs.createWriteStream('data.gz'),
        );
    console.timeEnd('GZIP COMPRESS TIME');
    console.log('GZIP COMPRESS SIZE:', fs.statSync('data.gz').size); // fs.stat'ı senkronize çalıştırmamız gerekli. 
    //asenkron çalıştırdığımızda yanıt alamıyoruz.


    console.time('GZIP DECOMPRESS TIME');

    await pipelineAsync (
        fs.createReadStream('data.gz'),
        zlib.createUnzip(),
        fs.createWriteStream('dataforgz.hex'),
    );

    console.timeEnd('GZIP DECOMPRESS TIME');
    console.log('GZIP DECOMPRESS SIZE:', fs.statSync('dataforgz.hex').size); 
    } catch (err){
       console.error('failed.' , err);
     
  }
}

 runBrotli() 
 runGzip()