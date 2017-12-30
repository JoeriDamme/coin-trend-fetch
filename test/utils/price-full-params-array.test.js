const { expect } = require('chai');
const coinArray = require('./testdata/coinlist-array').data;
const methodUnderTest = require('../../utils/price-full-params-array');

describe('utils/price-full-params-array.js', () => {
  it('should create two dimensional array with coin symbols', () => {
    const result = methodUnderTest(coinArray);

    expect(result).to.be.an.instanceof(Array);
    expect(result).to.have.lengthOf(2);
    result.forEach((param) => {
      expect(param).to.be.an.instanceof(Array);
      expect(param.join(',')).to.have.lengthOf.below(301);
    });
    expect(result[0].join(',')).to.equal('42,365,404,611,808,888,1337,2015,BTC,ETH,LTC,DASH,XMR,NXT,ETC,DOGE,ZEC,BTS,DGB,XRP,BTCD,PPC,CRAIG,XBS,XPY,PRC,YBC,DANK,GIVE,KOBO,DT,CETI,SUP,XPD,GEO,CHASH,SPR,NXTI,WOLF,XDP,AC,ACOIN,AERO,ALF,AGS,AMC,ALN,APEX,ARCH,ARG,ARI,AUR,AXR,BCX,BEN,BET,BITB,BLU,BLK,BOST,BQC,XMY,MOON,ZET,SXC,QTL,ENRG,QRK,RIC,DGC');
    expect(result[1].join(',')).to.equal('LIMX,BTB,CAIX,BTG*,BTM,BUK,CACH,CAP,CBX,CCN,CIN,CINNI,CXC,CLAM,CLOAK,CLR,CMC,CNC,CNL,COMM,COOL,CRACK,CRC,CRYPT,CSC,DEM,DMD,XVG,DRKC,DSB');
  });
});
