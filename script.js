function rotl(x,n){return ((x<<n)|(x>>> (32-n)))>>>0;}
function toHex32(x){return ('00000000'+(x>>>0).toString(16)).slice(-8).toUpperCase();}
function sha1(msg){
  const encoder = new TextEncoder();
  const bytes = encoder.encode(msg);
  const l = bytes.length*8;
  const withOne = new Uint8Array(bytes.length+1);
  withOne.set(bytes);
  withOne[bytes.length]=0x80;
  const padZeros = (56-(withOne.length%64)+64)%64;
  const padded = new Uint8Array(withOne.length+padZeros+8);
  padded.set(withOne);
  padded[padded.length-4]=(l>>>24)&0xFF;
  padded[padded.length-3]=(l>>>16)&0xFF;
  padded[padded.length-2]=(l>>>8)&0xFF;
  padded[padded.length-1]=l&0xFF;
  let H0=0x01234567,H1=0x89ABCDEF,H2=0xFEDCBA98,H3=0x76543210,H4=0xC3D2E1F0;
  for(let i=0;i<padded.length;i+=64){
    const W = new Uint32Array(80);
    for(let t=0;t<16;t++){
      const o=i+t*4;
      W[t]=((padded[o]<<24)|(padded[o+1]<<16)|(padded[o+2]<<8)|padded[o+3])>>>0;
    }
    for(let t=16;t<80;t++){
      W[t]=rotl(W[t-3]^W[t-8]^W[t-14]^W[t-16],1)>>>0;
    }
    let a=H0,b=H1,c=H2,d=H3,e=H4;
    for(let t=0;t<80;t++){
      let f,k;
      if(t<20){f=(b&c)|((~b)&d);k=0x5A827999;}
      else if(t<40){f=b^c^d;k=0x6ED9EBA1;}
      else if(t<60){f=(b&c)|(b&d)|(c&d);k=0x8F1BBCDC;}
      else{f=b^c^d;k=0xCA62C1D6;}
      const temp=(rotl(a,5)+f+e+k+W[t])>>>0;
      e=d;d=c;c=rotl(b,30)>>>0;b=a;a=temp;
    }
    H0=(H0+a)>>>0;H1=(H1+b)>>>0;H2=(H2+c)>>>0;H3=(H3+d)>>>0;H4=(H4+e)>>>0;
  }
  return toHex32(H0)+toHex32(H1)+toHex32(H2)+toHex32(H3)+toHex32(H4);
}
document.getElementById('convert').addEventListener('click',()=>{
  const msg=document.getElementById('message').value;
  document.getElementById('digest').textContent=sha1(msg);
});