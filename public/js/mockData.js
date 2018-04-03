'use strict';

const mockData = [
	{
		symbol: 'BTC',
		price_usd: '7375.46',
		percent_change_24h: '5.9'
	},
	{
		symbol: 'ETH',
		price_usd: '398.542',
		percent_change_24h: '3.87'
	},
	{
		symbol: 'XRP',
		price_usd: '0.518102',
		percent_change_24h: '6.11'
	},
	{
		symbol: 'BCH',
		price_usd: '695.076',
		percent_change_24h: '4.94'
	},
	{
		symbol: 'LTC',
		price_usd: '122.952',
		percent_change_24h: '3.94'
	},
	{
		symbol: 'EOS',
		price_usd: '6.04517',
		percent_change_24h: '6.27'
	},
	{
		symbol: 'XLM',
		price_usd: '0.234705',
		percent_change_24h: '11.53'
	},
	{
		symbol: 'ADA',
		price_usd: '0.164195',
		percent_change_24h: '8.93'
	},
	{
		symbol: 'NEO',
		price_usd: '51.5201',
		percent_change_24h: '7.93'
	},
	{
		symbol: 'MIOTA',
		price_usd: '1.07764',
		percent_change_24h: '4.63'
	},
	{
		symbol: 'XMR',
		price_usd: '185.675',
		percent_change_24h: '4.48'
	},
	{
		symbol: 'DASH',
		price_usd: '325.219',
		percent_change_24h: '10.0'
	},
	{
		symbol: 'TRX',
		price_usd: '0.0354395',
		percent_change_24h: '10.2'
	},
	{
		symbol: 'USDT',
		price_usd: '0.999032',
		percent_change_24h: '-0.3'
	},
	{
		symbol: 'XEM',
		price_usd: '0.242768',
		percent_change_24h: '15.22'
	},
	{
		symbol: 'VEN',
		price_usd: '3.04882',
		percent_change_24h: '31.69'
	},
	{
		symbol: 'ETC',
		price_usd: '14.7115',
		percent_change_24h: '6.1'
	},
	{
		symbol: 'BNB',
		price_usd: '12.4081',
		percent_change_24h: '11.4'
	},
	{
		symbol: 'QTUM',
		price_usd: '14.9946',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'OMG',
		price_usd: '9.32361',
		percent_change_24h: '12.43'
	},
	{
		symbol: 'LSK',
		price_usd: '8.51318',
		percent_change_24h: '16.99'
	},
	{
		symbol: 'ICX',
		price_usd: '2.25719',
		percent_change_24h: '9.73'
	},
	{
		symbol: 'XVG',
		price_usd: '0.0546221',
		percent_change_24h: '19.03'
	},
	{
		symbol: 'NANO',
		price_usd: '5.71608',
		percent_change_24h: '8.23'
	},
	{
		symbol: 'BTG',
		price_usd: '44.6501',
		percent_change_24h: '7.44'
	},
	{
		symbol: 'ZEC',
		price_usd: '199.682',
		percent_change_24h: '4.46'
	},
	{
		symbol: 'STEEM',
		price_usd: '2.21591',
		percent_change_24h: '53.9'
	},
	{
		symbol: 'ONT',
		price_usd: '2.13445',
		percent_change_24h: '2.1'
	},
	{
		symbol: 'BTM',
		price_usd: '0.494628',
		percent_change_24h: '5.47'
	},
	{
		symbol: 'DGD',
		price_usd: '236.476',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'PPT',
		price_usd: '12.3203',
		percent_change_24h: '5.99'
	},
	{
		symbol: 'BTS',
		price_usd: '0.1632',
		percent_change_24h: '20.61'
	},
	{
		symbol: 'BCN',
		price_usd: '0.00227258',
		percent_change_24h: '4.57'
	},
	{
		symbol: 'WAVES',
		price_usd: '4.0055',
		percent_change_24h: '13.03'
	},
	{
		symbol: 'STRAT',
		price_usd: '3.93619',
		percent_change_24h: '15.39'
	},
	{
		symbol: 'SC',
		price_usd: '0.0111335',
		percent_change_24h: '8.09'
	},
	{
		symbol: 'AE',
		price_usd: '1.5416',
		percent_change_24h: '4.1'
	},
	{
		symbol: 'RHOC',
		price_usd: '0.993245',
		percent_change_24h: '6.15'
	},
	{
		symbol: 'SNT',
		price_usd: '0.101577',
		percent_change_24h: '21.05'
	},
	{
		symbol: 'DOGE',
		price_usd: '0.00289652',
		percent_change_24h: '4.23'
	},
	{
		symbol: 'BCD',
		price_usd: '2.14778',
		percent_change_24h: '1.25'
	},
	{
		symbol: 'MKR',
		price_usd: '523.979',
		percent_change_24h: '5.63'
	},
	{
		symbol: 'DCR',
		price_usd: '43.7682',
		percent_change_24h: '9.02'
	},
	{
		symbol: 'ZIL',
		price_usd: '0.0462925',
		percent_change_24h: '4.09'
	},
	{
		symbol: 'REP',
		price_usd: '27.2474',
		percent_change_24h: '9.76'
	},
	{
		symbol: 'KMD',
		price_usd: '2.82112',
		percent_change_24h: '19.56'
	},
	{
		symbol: 'ZRX',
		price_usd: '0.551725',
		percent_change_24h: '5.2'
	},
	{
		symbol: 'ARDR',
		price_usd: '0.264329',
		percent_change_24h: '21.44'
	},
	{
		symbol: 'WTC',
		price_usd: '10.4484',
		percent_change_24h: '10.07'
	},
	{
		symbol: 'VERI',
		price_usd: '125.348',
		percent_change_24h: '1.1'
	},
	{
		symbol: 'HSR',
		price_usd: '5.81724',
		percent_change_24h: '3.92'
	},
	{
		symbol: 'AION',
		price_usd: '2.11752',
		percent_change_24h: '10.04'
	},
	{
		symbol: 'ARK',
		price_usd: '2.28003',
		percent_change_24h: '18.18'
	},
	{
		symbol: 'CNX',
		price_usd: '5.10787',
		percent_change_24h: '7.02'
	},
	{
		symbol: 'PIVX',
		price_usd: '4.11795',
		percent_change_24h: '9.18'
	},
	{
		symbol: 'LRC',
		price_usd: '0.385657',
		percent_change_24h: '3.22'
	},
	{
		symbol: 'KCS',
		price_usd: '2.37421',
		percent_change_24h: '4.71'
	},
	{
		symbol: 'QASH',
		price_usd: '0.614827',
		percent_change_24h: '5.32'
	},
	{
		symbol: 'BAT',
		price_usd: '0.208661',
		percent_change_24h: '7.38'
	},
	{
		symbol: 'MONA',
		price_usd: '3.51077',
		percent_change_24h: '13.18'
	},
	{
		symbol: 'IOST',
		price_usd: '0.0241694',
		percent_change_24h: '9.67'
	},
	{
		symbol: 'DGB',
		price_usd: '0.0184762',
		percent_change_24h: '6.11'
	},
	{
		symbol: 'FCT',
		price_usd: '21.2251',
		percent_change_24h: '8.62'
	},
	{
		symbol: 'NAS',
		price_usd: '5.00965',
		percent_change_24h: '6.02'
	},
	{
		symbol: 'GNT',
		price_usd: '0.210306',
		percent_change_24h: '6.92'
	},
	{
		symbol: 'GXS',
		price_usd: '2.71036',
		percent_change_24h: '3.9'
	},
	{
		symbol: 'GAS',
		price_usd: '16.1622',
		percent_change_24h: '6.6'
	},
	{
		symbol: 'ETHOS',
		price_usd: '2.11776',
		percent_change_24h: '8.96'
	},
	{
		symbol: 'R',
		price_usd: '0.849671',
		percent_change_24h: '2.1'
	},
	{
		symbol: 'SYS',
		price_usd: '0.287966',
		percent_change_24h: '6.63'
	},
	{
		symbol: 'DRGN',
		price_usd: '0.631136',
		percent_change_24h: '7.3'
	},
	{
		symbol: 'FUN',
		price_usd: '0.0315574',
		percent_change_24h: '4.97'
	},
	{
		symbol: 'KNC',
		price_usd: '1.02555',
		percent_change_24h: '8.57'
	},
	{
		symbol: 'ELF',
		price_usd: '0.547526',
		percent_change_24h: '1.58'
	},
	{
		symbol: 'XZC',
		price_usd: '30.3718',
		percent_change_24h: '5.53'
	},
	{
		symbol: 'STORM',
		price_usd: '0.0323993',
		percent_change_24h: '8.86'
	},
	{
		symbol: 'ETN',
		price_usd: '0.0196368',
		percent_change_24h: '-1.07'
	},
	{
		symbol: 'SUB',
		price_usd: '0.367008',
		percent_change_24h: '12.04'
	},
	{
		symbol: 'KIN',
		price_usd: '0.00017123',
		percent_change_24h: '0.73'
	},
	{
		symbol: 'POWR',
		price_usd: '0.343035',
		percent_change_24h: '28.63'
	},
	{
		symbol: 'RDD',
		price_usd: '0.00430872',
		percent_change_24h: '10.15'
	},
	{
		symbol: 'NXT',
		price_usd: '0.122526',
		percent_change_24h: '11.53'
	},
	{
		symbol: 'SALT',
		price_usd: '2.14538',
		percent_change_24h: '7.42'
	},
	{
		symbol: 'MITH',
		price_usd: '0.399014',
		percent_change_24h: '-5.0'
	},
	{
		symbol: 'MAID',
		price_usd: '0.262411',
		percent_change_24h: '7.71'
	},
	{
		symbol: 'GBYTE',
		price_usd: '179.319',
		percent_change_24h: '4.68'
	},
	{
		symbol: 'ENG',
		price_usd: '1.54564',
		percent_change_24h: '9.92'
	},
	{
		symbol: 'DENT',
		price_usd: '0.0108137',
		percent_change_24h: '19.57'
	},
	{
		symbol: 'NCASH',
		price_usd: '0.0276488',
		percent_change_24h: '5.97'
	},
	{
		symbol: 'NEBL',
		price_usd: '8.38962',
		percent_change_24h: '15.06'
	},
	{
		symbol: 'STORJ',
		price_usd: '0.813501',
		percent_change_24h: '28.88'
	},
	{
		symbol: 'SKY',
		price_usd: '13.6229',
		percent_change_24h: '6.58'
	},
	{
		symbol: 'REQ',
		price_usd: '0.158363',
		percent_change_24h: '3.46'
	},
	{
		symbol: 'BNT',
		price_usd: '2.27661',
		percent_change_24h: '4.12'
	},
	{
		symbol: 'EMC',
		price_usd: '2.43868',
		percent_change_24h: '10.05'
	},
	{
		symbol: 'LINK',
		price_usd: '0.285953',
		percent_change_24h: '6.47'
	},
	{
		symbol: 'PAY',
		price_usd: '0.933951',
		percent_change_24h: '7.25'
	},
	{
		symbol: 'DROP',
		price_usd: '0.00534269',
		percent_change_24h: '-0.37'
	},
	{
		symbol: 'WAX',
		price_usd: '0.155283',
		percent_change_24h: '14.4'
	},
	{
		symbol: 'DCN',
		price_usd: '0.000293824',
		percent_change_24h: '4.89'
	},
	{
		symbol: 'GNX',
		price_usd: '0.399537',
		percent_change_24h: '4.56'
	},
	{
		symbol: 'ACT',
		price_usd: '0.202648',
		percent_change_24h: '3.71'
	},
	{
		symbol: 'PART',
		price_usd: '10.4353',
		percent_change_24h: '14.81'
	},
	{
		symbol: 'CND',
		price_usd: '0.0640898',
		percent_change_24h: '5.61'
	},
	{
		symbol: 'VTC',
		price_usd: '2.00704',
		percent_change_24h: '24.5'
	},
	{
		symbol: 'NXS',
		price_usd: '1.5441',
		percent_change_24h: '3.89'
	},
	{
		symbol: 'MTL',
		price_usd: '3.8488',
		percent_change_24h: '17.66'
	},
	{
		symbol: 'CS',
		price_usd: '0.6272',
		percent_change_24h: '12.79'
	},
	{
		symbol: 'POLY',
		price_usd: '0.35483',
		percent_change_24h: '7.31'
	},
	{
		symbol: 'NULS',
		price_usd: '2.04787',
		percent_change_24h: '0.27'
	},
	{
		symbol: 'MNX',
		price_usd: '22.7934',
		percent_change_24h: '8.17'
	},
	{
		symbol: 'MAN',
		price_usd: '0.535167',
		percent_change_24h: '2.2'
	},
	{
		symbol: 'ICN',
		price_usd: '0.779438',
		percent_change_24h: '7.85'
	},
	{
		symbol: 'GVT',
		price_usd: '20.8358',
		percent_change_24h: '1.75'
	},
	{
		symbol: 'ENJ',
		price_usd: '0.101996',
		percent_change_24h: '5.97'
	},
	{
		symbol: 'MANA',
		price_usd: '0.0726603',
		percent_change_24h: '8.6'
	},
	{
		symbol: 'POA',
		price_usd: '0.365256',
		percent_change_24h: '8.35'
	},
	{
		symbol: 'BTX',
		price_usd: '5.66121',
		percent_change_24h: '10.77'
	},
	{
		symbol: 'CVC',
		price_usd: '0.212847',
		percent_change_24h: '8.69'
	},
	{
		symbol: 'AUTO',
		price_usd: '0.0115711',
		percent_change_24h: '1.13'
	},
	{
		symbol: 'GAME',
		price_usd: '1.12266',
		percent_change_24h: '2.71'
	},
	{
		symbol: 'PRL',
		price_usd: '0.921657',
		percent_change_24h: '6.23'
	},
	{
		symbol: 'ZEN',
		price_usd: '20.1615',
		percent_change_24h: '17.41'
	},
	{
		symbol: 'DTR',
		price_usd: '0.0593913',
		percent_change_24h: '-4.65'
	},
	{
		symbol: 'RLC',
		price_usd: '0.880688',
		percent_change_24h: '6.16'
	},
	{
		symbol: 'BLOCK',
		price_usd: '13.5084',
		percent_change_24h: '3.75'
	},
	{
		symbol: 'THETA',
		price_usd: '0.116572',
		percent_change_24h: '7.78'
	},
	{
		symbol: 'QSP',
		price_usd: '0.106519',
		percent_change_24h: '9.1'
	},
	{
		symbol: 'TNB',
		price_usd: '0.0289012',
		percent_change_24h: '5.72'
	},
	{
		symbol: 'GNO',
		price_usd: '58.8654',
		percent_change_24h: '5.05'
	},
	{
		symbol: 'RDN',
		price_usd: '1.29247',
		percent_change_24h: '3.15'
	},
	{
		symbol: 'SMART',
		price_usd: '0.0760118',
		percent_change_24h: '11.25'
	},
	{
		symbol: 'AGI',
		price_usd: '0.122498',
		percent_change_24h: '6.84'
	},
	{
		symbol: 'MCO',
		price_usd: '4.82374',
		percent_change_24h: '9.92'
	},
	{
		symbol: 'IGNIS',
		price_usd: '0.0823578',
		percent_change_24h: '13.05'
	},
	{
		symbol: 'BTCD',
		price_usd: '48.0401',
		percent_change_24h: '-3.74'
	},
	{
		symbol: 'SAN',
		price_usd: '0.982204',
		percent_change_24h: '2.42'
	},
	{
		symbol: 'POE',
		price_usd: '0.0272682',
		percent_change_24h: '9.34'
	},
	{
		symbol: 'PPP',
		price_usd: '0.742859',
		percent_change_24h: '11.65'
	},
	{
		symbol: 'ANT',
		price_usd: '2.30751',
		percent_change_24h: '2.16'
	},
	{
		symbol: 'DBC',
		price_usd: '0.0396062',
		percent_change_24h: '5.52'
	},
	{
		symbol: 'PLR',
		price_usd: '0.256847',
		percent_change_24h: '-9.43'
	},
	{
		symbol: 'UBQ',
		price_usd: '1.39913',
		percent_change_24h: '9.71'
	},
	{
		symbol: 'FSN',
		price_usd: '2.00381',
		percent_change_24h: '7.09'
	},
	{
		symbol: 'DEW',
		price_usd: '0.534747',
		percent_change_24h: '0.82'
	},
	{
		symbol: 'SRN',
		price_usd: '0.237569',
		percent_change_24h: '6.31'
	},
	{
		symbol: 'NAV',
		price_usd: '0.862489',
		percent_change_24h: '6.52'
	},
	{
		symbol: 'ABT',
		price_usd: '0.568279',
		percent_change_24h: '2.99'
	},
	{
		symbol: 'TKY',
		price_usd: '0.0144268',
		percent_change_24h: '3.11'
	},
	{
		symbol: 'EDO',
		price_usd: '1.72068',
		percent_change_24h: '7.93'
	},
	{
		symbol: 'BLZ',
		price_usd: '0.303164',
		percent_change_24h: '3.77'
	},
	{
		symbol: 'TEL',
		price_usd: '0.00175195',
		percent_change_24h: '6.4'
	},
	{
		symbol: 'GTO',
		price_usd: '0.181876',
		percent_change_24h: '2.99'
	},
	{
		symbol: 'XAS',
		price_usd: '0.525791',
		percent_change_24h: '1.49'
	},
	{
		symbol: 'BOS',
		price_usd: '0.112604',
		percent_change_24h: '-5.68'
	},
	{
		symbol: 'CMT',
		price_usd: '0.081061',
		percent_change_24h: '5.8'
	},
	{
		symbol: 'XDN',
		price_usd: '0.00696022',
		percent_change_24h: '7.23'
	},
	{
		symbol: 'LEND',
		price_usd: '0.0438584',
		percent_change_24h: '6.32'
	},
	{
		symbol: 'SMT',
		price_usd: '0.0331445',
		percent_change_24h: '6.78'
	},
	{
		symbol: 'EVN',
		price_usd: '0.435301',
		percent_change_24h: '3.01'
	},
	{
		symbol: 'BIX',
		price_usd: '0.441535',
		percent_change_24h: '-1.15'
	},
	{
		symbol: 'MED',
		price_usd: '0.0157476',
		percent_change_24h: '0.89'
	},
	{
		symbol: 'VEE',
		price_usd: '0.0302303',
		percent_change_24h: '5.5'
	},
	{
		symbol: 'BCO',
		price_usd: '1.69469',
		percent_change_24h: '19.97'
	},
	{
		symbol: 'DDD',
		price_usd: '0.151172',
		percent_change_24h: '7.09'
	},
	{
		symbol: 'QRL',
		price_usd: '0.871436',
		percent_change_24h: '5.86'
	},
	{
		symbol: 'ADX',
		price_usd: '0.607923',
		percent_change_24h: '5.48'
	},
	{
		symbol: 'ION',
		price_usd: '2.17627',
		percent_change_24h: '-1.53'
	},
	{
		symbol: 'XBY',
		price_usd: '0.103327',
		percent_change_24h: '4.45'
	},
	{
		symbol: 'RUFF',
		price_usd: '0.0533728',
		percent_change_24h: '2.92'
	},
	{
		symbol: 'SLS',
		price_usd: '43.4341',
		percent_change_24h: '-7.62'
	},
	{
		symbol: 'LOOM',
		price_usd: '0.102059',
		percent_change_24h: '9.89'
	},
	{
		symbol: 'SPHTX',
		price_usd: '0.223366',
		percent_change_24h: '5.76'
	},
	{
		symbol: 'EDG',
		price_usd: '0.521834',
		percent_change_24h: '5.11'
	},
	{
		symbol: 'C20',
		price_usd: '1.0783',
		percent_change_24h: '4.63'
	},
	{
		symbol: 'MDS',
		price_usd: '0.0874223',
		percent_change_24h: '4.58'
	},
	{
		symbol: 'AMB',
		price_usd: '0.289585',
		percent_change_24h: '-1.56'
	},
	{
		symbol: 'EMC2',
		price_usd: '0.192453',
		percent_change_24h: '28.74'
	},
	{
		symbol: 'RCN',
		price_usd: '0.0849965',
		percent_change_24h: '2.07'
	},
	{
		symbol: 'ITC',
		price_usd: '0.850295',
		percent_change_24h: '10.88'
	},
	{
		symbol: 'OST',
		price_usd: '0.14073',
		percent_change_24h: '10.43'
	},
	{
		symbol: 'DTA',
		price_usd: '0.00872458',
		percent_change_24h: '4.15'
	},
	{
		symbol: 'PPC',
		price_usd: '1.6305',
		percent_change_24h: '3.08'
	},
	{
		symbol: 'PURA',
		price_usd: '0.23047',
		percent_change_24h: '8.33'
	},
	{
		symbol: 'AST',
		price_usd: '0.261641',
		percent_change_24h: '5.99'
	},
	{
		symbol: 'RPX',
		price_usd: '0.0719167',
		percent_change_24h: '6.26'
	},
	{
		symbol: 'SNM',
		price_usd: '0.107392',
		percent_change_24h: '7.31'
	},
	{
		symbol: 'ORME',
		price_usd: '2.259',
		percent_change_24h: '10.11'
	},
	{
		symbol: 'GRS',
		price_usd: '0.549242',
		percent_change_24h: '93.29'
	},
	{
		symbol: 'UTK',
		price_usd: '0.133307',
		percent_change_24h: '4.03'
	},
	{
		symbol: 'SPANK',
		price_usd: '0.127022',
		percent_change_24h: '11.58'
	},
	{
		symbol: 'HPB',
		price_usd: '1.70254',
		percent_change_24h: '-16.21'
	},
	{
		symbol: 'FTC',
		price_usd: '0.191277',
		percent_change_24h: '8.13'
	},
	{
		symbol: 'NLG',
		price_usd: '0.0944844',
		percent_change_24h: '16.18'
	},
	{
		symbol: 'BAY',
		price_usd: '0.0368485',
		percent_change_24h: '3.74'
	},
	{
		symbol: 'WPR',
		price_usd: '0.0923132',
		percent_change_24h: '5.74'
	},
	{
		symbol: 'QLC',
		price_usd: '0.151383',
		percent_change_24h: '8.53'
	},
	{
		symbol: 'WINGS',
		price_usd: '0.397849',
		percent_change_24h: '8.46'
	},
	{
		symbol: 'CRPT',
		price_usd: '0.452235',
		percent_change_24h: '-6.71'
	},
	{
		symbol: 'XP',
		price_usd: '0.000158403',
		percent_change_24h: '-5.11'
	},
	{
		symbol: 'RVN',
		price_usd: '0.0459074',
		percent_change_24h: '9.65'
	},
	{
		symbol: 'NPXS',
		price_usd: '0.000827063',
		percent_change_24h: '2.15'
	},
	{
		symbol: 'MOD',
		price_usd: '1.89801',
		percent_change_24h: '15.45'
	},
	{
		symbol: 'PAYX',
		price_usd: '0.505464',
		percent_change_24h: '-9.52'
	},
	{
		symbol: 'CSC',
		price_usd: '0.000954268',
		percent_change_24h: '5.89'
	},
	{
		symbol: 'VIBE',
		price_usd: '0.171309',
		percent_change_24h: '7.56'
	},
	{
		symbol: 'NGC',
		price_usd: '0.583918',
		percent_change_24h: '6.35'
	},
	{
		symbol: 'SNGLS',
		price_usd: '0.0558138',
		percent_change_24h: '4.1'
	},
	{
		symbol: 'APPC',
		price_usd: '0.333381',
		percent_change_24h: '5.13'
	},
	{
		symbol: 'DATA',
		price_usd: '0.0492455',
		percent_change_24h: '-3.66'
	},
	{
		symbol: 'BRD',
		price_usd: '0.447058',
		percent_change_24h: '2.31'
	},
	{
		symbol: 'TNT',
		price_usd: '0.0769875',
		percent_change_24h: '6.5'
	},
	{
		symbol: 'DNT',
		price_usd: '0.0542591',
		percent_change_24h: '-3.05'
	},
	{
		symbol: 'ZAP',
		price_usd: '0.291237',
		percent_change_24h: '139.58'
	},
	{
		symbol: 'SBD',
		price_usd: '2.85249',
		percent_change_24h: '96.14'
	},
	{
		symbol: 'MGO',
		price_usd: '0.326476',
		percent_change_24h: '7.24'
	},
	{
		symbol: 'RKT',
		price_usd: '0.11696',
		percent_change_24h: '2.89'
	},
	{
		symbol: 'TAAS',
		price_usd: '3.86979',
		percent_change_24h: '1.78'
	},
	{
		symbol: 'SOAR',
		price_usd: '0.0289859',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'TNC',
		price_usd: '0.0908716',
		percent_change_24h: '9.54'
	},
	{
		symbol: 'WGR',
		price_usd: '0.163601',
		percent_change_24h: '7.09'
	},
	{
		symbol: 'INS',
		price_usd: '1.06655',
		percent_change_24h: '5.01'
	},
	{
		symbol: 'XCP',
		price_usd: '11.4059',
		percent_change_24h: '4.21'
	},
	{
		symbol: 'VIA',
		price_usd: '1.29586',
		percent_change_24h: '6.88'
	},
	{
		symbol: 'WABI',
		price_usd: '0.644868',
		percent_change_24h: '5.34'
	},
	{
		symbol: 'BTO',
		price_usd: '0.0816547',
		percent_change_24h: '1.36'
	},
	{
		symbol: 'FUEL',
		price_usd: '0.0594524',
		percent_change_24h: '4.4'
	},
	{
		symbol: 'INK',
		price_usd: '0.0615562',
		percent_change_24h: '-1.58'
	},
	{
		symbol: 'UTNP',
		price_usd: '0.0163805',
		percent_change_24h: '3.97'
	},
	{
		symbol: 'TRAC',
		price_usd: '0.109897',
		percent_change_24h: '7.74'
	},
	{
		symbol: 'IHT',
		price_usd: '0.0842708',
		percent_change_24h: '-0.61'
	},
	{
		symbol: 'LBC',
		price_usd: '0.175664',
		percent_change_24h: '8.07'
	},
	{
		symbol: 'BITCNY',
		price_usd: '0.173769',
		percent_change_24h: '1.29'
	},
	{
		symbol: 'BURST',
		price_usd: '0.0153289',
		percent_change_24h: '11.96'
	},
	{
		symbol: 'JNT',
		price_usd: '0.183311',
		percent_change_24h: '2.38'
	},
	{
		symbol: 'PRE',
		price_usd: '0.176331',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'CLOAK',
		price_usd: '5.31527',
		percent_change_24h: '6.34'
	},
	{
		symbol: 'UNO',
		price_usd: '136.873',
		percent_change_24h: '3.26'
	},
	{
		symbol: 'BCPT',
		price_usd: '0.38685',
		percent_change_24h: '7.54'
	},
	{
		symbol: 'DPY',
		price_usd: '0.692127',
		percent_change_24h: '5.94'
	},
	{
		symbol: 'LEO',
		price_usd: '0.265896',
		percent_change_24h: '3.06'
	},
	{
		symbol: 'AEON',
		price_usd: '1.69345',
		percent_change_24h: '16.64'
	},
	{
		symbol: 'MLN',
		price_usd: '43.6469',
		percent_change_24h: '-7.71'
	},
	{
		symbol: 'UKG',
		price_usd: '0.183098',
		percent_change_24h: '11.09'
	},
	{
		symbol: 'TRIG',
		price_usd: '0.801105',
		percent_change_24h: '10.45'
	},
	{
		symbol: 'GTC',
		price_usd: '0.045402',
		percent_change_24h: '4.89'
	},
	{
		symbol: 'MOON',
		price_usd: '0.000114414',
		percent_change_24h: '62.54'
	},
	{
		symbol: 'HTML',
		price_usd: '0.000386411',
		percent_change_24h: '-2.96'
	},
	{
		symbol: 'ETP',
		price_usd: '0.666644',
		percent_change_24h: '2.39'
	},
	{
		symbol: 'ERA',
		price_usd: '0.0740659',
		percent_change_24h: '5.29'
	},
	{
		symbol: 'IDH',
		price_usd: '0.0613887',
		percent_change_24h: '7.05'
	},
	{
		symbol: 'KICK',
		price_usd: '0.0524468',
		percent_change_24h: '6.29'
	},
	{
		symbol: 'CDT',
		price_usd: '0.0361685',
		percent_change_24h: '3.57'
	},
	{
		symbol: 'MOBI',
		price_usd: '0.0598688',
		percent_change_24h: '5.65'
	},
	{
		symbol: 'LET',
		price_usd: '0.0375111',
		percent_change_24h: '11.95'
	},
	{
		symbol: 'SPC',
		price_usd: '0.0431469',
		percent_change_24h: '12.48'
	},
	{
		symbol: 'LGO',
		price_usd: '0.18616',
		percent_change_24h: '6.59'
	},
	{
		symbol: 'VIB',
		price_usd: '0.132193',
		percent_change_24h: '14.99'
	},
	{
		symbol: 'NMC',
		price_usd: '1.48544',
		percent_change_24h: '0.74'
	},
	{
		symbol: 'HAV',
		price_usd: '0.362262',
		percent_change_24h: '5.72'
	},
	{
		symbol: 'AMP',
		price_usd: '0.215865',
		percent_change_24h: '7.22'
	},
	{
		symbol: 'LKK',
		price_usd: '0.0683162',
		percent_change_24h: '8.24'
	},
	{
		symbol: 'SAFEX',
		price_usd: '0.0136322',
		percent_change_24h: '4.96'
	},
	{
		symbol: 'CPC',
		price_usd: '0.0914628',
		percent_change_24h: '3.91'
	},
	{
		symbol: 'CRW',
		price_usd: '1.14895',
		percent_change_24h: '3.82'
	},
	{
		symbol: 'SHIFT',
		price_usd: '1.7254',
		percent_change_24h: '6.75'
	},
	{
		symbol: 'FLASH',
		price_usd: '0.0227221',
		percent_change_24h: '8.65'
	},
	{
		symbol: 'TOMO',
		price_usd: '0.369748',
		percent_change_24h: '4.86'
	},
	{
		symbol: 'NET',
		price_usd: '1.91843',
		percent_change_24h: '2.47'
	},
	{
		symbol: 'XEL',
		price_usd: '0.22161',
		percent_change_24h: '15.99'
	},
	{
		symbol: 'POT',
		price_usd: '0.0914656',
		percent_change_24h: '6.45'
	},
	{
		symbol: 'FOTA',
		price_usd: '0.0499384',
		percent_change_24h: '4.0'
	},
	{
		symbol: 'DAI',
		price_usd: '1.01669',
		percent_change_24h: '1.65'
	},
	{
		symbol: 'LUN',
		price_usd: '8.63276',
		percent_change_24h: '17.76'
	},
	{
		symbol: 'OCN',
		price_usd: '0.00980317',
		percent_change_24h: '13.1'
	},
	{
		symbol: 'TKN',
		price_usd: '0.785474',
		percent_change_24h: '0.12'
	},
	{
		symbol: 'XPA',
		price_usd: '0.340994',
		percent_change_24h: '9.71'
	},
	{
		symbol: 'HMQ',
		price_usd: '0.119383',
		percent_change_24h: '10.53'
	},
	{
		symbol: 'SXDT',
		price_usd: '0.234836',
		percent_change_24h: '-0.97'
	},
	{
		symbol: 'MSP',
		price_usd: '0.137016',
		percent_change_24h: '10.96'
	},
	{
		symbol: 'SNC',
		price_usd: '0.159497',
		percent_change_24h: '4.45'
	},
	{
		symbol: 'YOYOW',
		price_usd: '0.0747762',
		percent_change_24h: '9.34'
	},
	{
		symbol: 'MER',
		price_usd: '0.18995',
		percent_change_24h: '31.4'
	},
	{
		symbol: 'DCT',
		price_usd: '0.368824',
		percent_change_24h: '7.37'
	},
	{
		symbol: 'ONION',
		price_usd: '1.54193',
		percent_change_24h: '10.32'
	},
	{
		symbol: 'CFI',
		price_usd: '0.0581656',
		percent_change_24h: '10.46'
	},
	{
		symbol: 'MTH',
		price_usd: '0.0859079',
		percent_change_24h: '9.57'
	},
	{
		symbol: 'ECC',
		price_usd: '0.00073283',
		percent_change_24h: '3.5'
	},
	{
		symbol: 'DAT',
		price_usd: '0.0220232',
		percent_change_24h: '6.78'
	},
	{
		symbol: 'EDR',
		price_usd: '0.0205985',
		percent_change_24h: '12.69'
	},
	{
		symbol: 'DMD',
		price_usd: '6.70975',
		percent_change_24h: '7.81'
	},
	{
		symbol: 'INT',
		price_usd: '0.121462',
		percent_change_24h: '4.34'
	},
	{
		symbol: 'ZCL',
		price_usd: '4.90534',
		percent_change_24h: '7.03'
	},
	{
		symbol: 'BITB',
		price_usd: '0.00722919',
		percent_change_24h: '5.0'
	},
	{
		symbol: 'DMT',
		price_usd: '0.443173',
		percent_change_24h: '-9.29'
	},
	{
		symbol: 'PEPECASH',
		price_usd: '0.0247703',
		percent_change_24h: '2.54'
	},
	{
		symbol: 'BKX',
		price_usd: '0.251403',
		percent_change_24h: '7.39'
	},
	{
		symbol: 'EVX',
		price_usd: '1.05086',
		percent_change_24h: '5.56'
	},
	{
		symbol: 'STQ',
		price_usd: '0.00220488',
		percent_change_24h: '11.67'
	},
	{
		symbol: 'PPY',
		price_usd: '4.30156',
		percent_change_24h: '2.74'
	},
	{
		symbol: 'BLK',
		price_usd: '0.221531',
		percent_change_24h: '12.5'
	},
	{
		symbol: 'ADT',
		price_usd: '0.0283385',
		percent_change_24h: '10.92'
	},
	{
		symbol: 'UP',
		price_usd: '0.124409',
		percent_change_24h: '6.45'
	},
	{
		symbol: 'HST',
		price_usd: '0.522302',
		percent_change_24h: '6.32'
	},
	{
		symbol: 'ATM',
		price_usd: '0.00356871',
		percent_change_24h: '5.46'
	},
	{
		symbol: 'ZPT',
		price_usd: '0.0560242',
		percent_change_24h: '4.97'
	},
	{
		symbol: 'DIME',
		price_usd: '0.0000304766',
		percent_change_24h: '-17.01'
	},
	{
		symbol: 'TIO',
		price_usd: '0.194845',
		percent_change_24h: '12.86'
	},
	{
		symbol: 'QUN',
		price_usd: '0.0237319',
		percent_change_24h: '4.94'
	},
	{
		symbol: 'REN',
		price_usd: '0.0357948',
		percent_change_24h: '3.58'
	},
	{
		symbol: 'XWC',
		price_usd: '0.0651321',
		percent_change_24h: '4.96'
	},
	{
		symbol: 'CAS',
		price_usd: '0.0462803',
		percent_change_24h: '11.66'
	},
	{
		symbol: 'PRG',
		price_usd: '0.247034',
		percent_change_24h: '1.67'
	},
	{
		symbol: 'STK',
		price_usd: '0.0466007',
		percent_change_24h: '3.8'
	},
	{
		symbol: 'NMR',
		price_usd: '11.7439',
		percent_change_24h: '9.2'
	},
	{
		symbol: 'BPT',
		price_usd: '0.305182',
		percent_change_24h: '1.73'
	},
	{
		symbol: 'BLT',
		price_usd: '0.331789',
		percent_change_24h: '5.11'
	},
	{
		symbol: 'UQC',
		price_usd: '1.5796',
		percent_change_24h: '12.33'
	},
	{
		symbol: 'MTN',
		price_usd: '0.0852634',
		percent_change_24h: '3.79'
	},
	{
		symbol: 'CHSB',
		price_usd: '0.0273664',
		percent_change_24h: '-1.37'
	},
	{
		symbol: 'ECA',
		price_usd: '0.000643957',
		percent_change_24h: '42.76'
	},
	{
		symbol: 'HVN',
		price_usd: '0.0411458',
		percent_change_24h: '-1.22'
	},
	{
		symbol: 'GRC',
		price_usd: '0.0394613',
		percent_change_24h: '-1.76'
	},
	{
		symbol: 'XPM',
		price_usd: '0.666025',
		percent_change_24h: '2.68'
	},
	{
		symbol: 'RVR',
		price_usd: '0.0732617',
		percent_change_24h: '4.83'
	},
	{
		symbol: 'PZM',
		price_usd: '0.94899',
		percent_change_24h: '3.39'
	},
	{
		symbol: '1ST',
		price_usd: '0.175974',
		percent_change_24h: '3.42'
	},
	{
		symbol: 'ELEC',
		price_usd: '0.0550776',
		percent_change_24h: '1.66'
	},
	{
		symbol: 'LINDA',
		price_usd: '0.00168874',
		percent_change_24h: '2.06'
	},
	{
		symbol: 'TRST',
		price_usd: '0.160805',
		percent_change_24h: '7.33'
	},
	{
		symbol: 'IOC',
		price_usd: '0.890112',
		percent_change_24h: '6.65'
	},
	{
		symbol: 'ACAT',
		price_usd: '0.00530095',
		percent_change_24h: '5.03'
	},
	{
		symbol: 'MDA',
		price_usd: '0.747946',
		percent_change_24h: '7.25'
	},
	{
		symbol: 'SIB',
		price_usd: '0.877521',
		percent_change_24h: '10.23'
	},
	{
		symbol: 'SWFTC',
		price_usd: '0.00827705',
		percent_change_24h: '5.99'
	},
	{
		symbol: 'GUP',
		price_usd: '0.192673',
		percent_change_24h: '25.5'
	},
	{
		symbol: 'TIX',
		price_usd: '0.358109',
		percent_change_24h: '38.7'
	},
	{
		symbol: 'NLC2',
		price_usd: '0.0695657',
		percent_change_24h: '0.56'
	},
	{
		symbol: 'BCA',
		price_usd: '0.792712',
		percent_change_24h: '17.99'
	},
	{
		symbol: 'PRO',
		price_usd: '0.812368',
		percent_change_24h: '5.82'
	},
	{
		symbol: 'KEY',
		price_usd: '0.00738484',
		percent_change_24h: '9.68'
	},
	{
		symbol: 'BITUSD',
		price_usd: '1.11959',
		percent_change_24h: '-0.43'
	},
	{
		symbol: 'VRC',
		price_usd: '0.452912',
		percent_change_24h: '10.2'
	},
	{
		symbol: 'CAT',
		price_usd: '0.0278292',
		percent_change_24h: '2.69'
	},
	{
		symbol: 'MTX',
		price_usd: '0.589469',
		percent_change_24h: '-12.86'
	},
	{
		symbol: 'CV',
		price_usd: '0.00250834',
		percent_change_24h: '5.73'
	},
	{
		symbol: 'RMT',
		price_usd: '0.0270574',
		percent_change_24h: '-15.98'
	},
	{
		symbol: 'TRUE',
		price_usd: '0.540853',
		percent_change_24h: '12.76'
	},
	{
		symbol: 'DLT',
		price_usd: '0.156161',
		percent_change_24h: '4.91'
	},
	{
		symbol: 'SOC',
		price_usd: '0.0275767',
		percent_change_24h: '-4.88'
	},
	{
		symbol: 'ZSC',
		price_usd: '0.0115419',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'ICOS',
		price_usd: '22.7808',
		percent_change_24h: '16.63'
	},
	{
		symbol: 'MUSE',
		price_usd: '0.89995',
		percent_change_24h: '3.46'
	},
	{
		symbol: 'DNA',
		price_usd: '0.210556',
		percent_change_24h: '11.27'
	},
	{
		symbol: 'BMC',
		price_usd: '0.612174',
		percent_change_24h: '4.02'
	},
	{
		symbol: 'MUE',
		price_usd: '0.100782',
		percent_change_24h: '11.04'
	},
	{
		symbol: 'MEE',
		price_usd: '0.0379635',
		percent_change_24h: '13.56'
	},
	{
		symbol: 'RFR',
		price_usd: '0.00547248',
		percent_change_24h: '1.56'
	},
	{
		symbol: 'PASC',
		price_usd: '0.666813',
		percent_change_24h: '4.7'
	},
	{
		symbol: 'BBN',
		price_usd: '0.0939398',
		percent_change_24h: '0.4'
	},
	{
		symbol: 'XTO',
		price_usd: '0.388974',
		percent_change_24h: '-19.97'
	},
	{
		symbol: 'OMNI',
		price_usd: '22.7004',
		percent_change_24h: '2.61'
	},
	{
		symbol: 'ARN',
		price_usd: '0.973001',
		percent_change_24h: '5.19'
	},
	{
		symbol: 'TSL',
		price_usd: '0.0217274',
		percent_change_24h: '15.06'
	},
	{
		symbol: 'YEE',
		price_usd: '0.00999268',
		percent_change_24h: '2.96'
	},
	{
		symbol: 'INCNT',
		price_usd: '0.274123',
		percent_change_24h: '7.35'
	},
	{
		symbol: 'COSS',
		price_usd: '0.193044',
		percent_change_24h: '5.93'
	},
	{
		symbol: 'XSH',
		price_usd: '0.0259546',
		percent_change_24h: '6.62'
	},
	{
		symbol: 'DIVX',
		price_usd: '2.42237',
		percent_change_24h: '32.7'
	},
	{
		symbol: 'DADI',
		price_usd: '0.161908',
		percent_change_24h: '5.63'
	},
	{
		symbol: 'BIS',
		price_usd: '1.41657',
		percent_change_24h: '1.32'
	},
	{
		symbol: 'LA',
		price_usd: '0.15844',
		percent_change_24h: '5.06'
	},
	{
		symbol: 'QBT',
		price_usd: '0.188407',
		percent_change_24h: '3.55'
	},
	{
		symbol: 'BOT',
		price_usd: '0.304684',
		percent_change_24h: '5.94'
	},
	{
		symbol: 'SLR',
		price_usd: '0.289776',
		percent_change_24h: '7.79'
	},
	{
		symbol: 'BDG',
		price_usd: '0.034067',
		percent_change_24h: '3.8'
	},
	{
		symbol: 'IPL',
		price_usd: '0.0596817',
		percent_change_24h: '7.01'
	},
	{
		symbol: 'GRID',
		price_usd: '0.304882',
		percent_change_24h: '-3.51'
	},
	{
		symbol: 'ART',
		price_usd: '0.396388',
		percent_change_24h: '-1.42'
	},
	{
		symbol: 'RADS',
		price_usd: '3.43537',
		percent_change_24h: '-13.82'
	},
	{
		symbol: 'OAX',
		price_usd: '0.476642',
		percent_change_24h: '5.25'
	},
	{
		symbol: 'TGT',
		price_usd: '0.0125068',
		percent_change_24h: '-18.06'
	},
	{
		symbol: 'POSW',
		price_usd: '0.269305',
		percent_change_24h: '6.98'
	},
	{
		symbol: 'PHR',
		price_usd: '1.61349',
		percent_change_24h: '20.51'
	},
	{
		symbol: 'XRL',
		price_usd: '0.155435',
		percent_change_24h: '9.88'
	},
	{
		symbol: 'TAU',
		price_usd: '0.0809092',
		percent_change_24h: '1.94'
	},
	{
		symbol: 'XUC',
		price_usd: '5.71682',
		percent_change_24h: '3.33'
	},
	{
		symbol: 'SHIP',
		price_usd: '0.0738536',
		percent_change_24h: '-0.24'
	},
	{
		symbol: 'IXT',
		price_usd: '0.314444',
		percent_change_24h: '8.14'
	},
	{
		symbol: 'EXP',
		price_usd: '1.40421',
		percent_change_24h: '5.0'
	},
	{
		symbol: 'THC',
		price_usd: '0.0479336',
		percent_change_24h: '5.53'
	},
	{
		symbol: 'MOT',
		price_usd: '0.280836',
		percent_change_24h: '1.64'
	},
	{
		symbol: 'RVT',
		price_usd: '0.418717',
		percent_change_24h: '49.99'
	},
	{
		symbol: 'MWAT',
		price_usd: '0.0263868',
		percent_change_24h: '9.71'
	},
	{
		symbol: 'XAUR',
		price_usd: '0.0860523',
		percent_change_24h: '5.89'
	},
	{
		symbol: 'OCT',
		price_usd: '0.361159',
		percent_change_24h: '3.09'
	},
	{
		symbol: 'CAPP',
		price_usd: '0.0277685',
		percent_change_24h: '0.84'
	},
	{
		symbol: 'DXT',
		price_usd: '0.0272789',
		percent_change_24h: '6.91'
	},
	{
		symbol: 'SWM',
		price_usd: '0.20691',
		percent_change_24h: '-4.77'
	},
	{
		symbol: 'COV',
		price_usd: '0.602448',
		percent_change_24h: '7.23'
	},
	{
		symbol: 'LYM',
		price_usd: '0.0192926',
		percent_change_24h: '-2.4'
	},
	{
		symbol: 'CLAM',
		price_usd: '3.50188',
		percent_change_24h: '11.15'
	},
	{
		symbol: 'NVST',
		price_usd: '0.685019',
		percent_change_24h: '73.8'
	},
	{
		symbol: 'ALIS',
		price_usd: '0.265844',
		percent_change_24h: '1.38'
	},
	{
		symbol: 'PRA',
		price_usd: '0.206651',
		percent_change_24h: '11.13'
	},
	{
		symbol: 'AIT',
		price_usd: '0.0190854',
		percent_change_24h: '13.76'
	},
	{
		symbol: 'LDC',
		price_usd: '0.0129963',
		percent_change_24h: '-19.64'
	},
	{
		symbol: 'NEU',
		price_usd: '0.352576',
		percent_change_24h: '1.45'
	},
	{
		symbol: 'BSD',
		price_usd: '0.539606',
		percent_change_24h: '8.84'
	},
	{
		symbol: 'UNIT',
		price_usd: '0.743729',
		percent_change_24h: '0.67'
	},
	{
		symbol: 'RMC',
		price_usd: '6606.47',
		percent_change_24h: '4.73'
	},
	{
		symbol: 'ALQO',
		price_usd: '0.288763',
		percent_change_24h: '2.76'
	},
	{
		symbol: 'LMC',
		price_usd: '0.0434559',
		percent_change_24h: '6.09'
	},
	{
		symbol: 'NYC',
		price_usd: '0.0000727931',
		percent_change_24h: '5.23'
	},
	{
		symbol: 'RBY',
		price_usd: '0.382253',
		percent_change_24h: '9.74'
	},
	{
		symbol: 'DTB',
		price_usd: '0.426012',
		percent_change_24h: '6.0'
	},
	{
		symbol: 'CAN',
		price_usd: '0.238687',
		percent_change_24h: '6.52'
	},
	{
		symbol: 'BBR',
		price_usd: '0.845628',
		percent_change_24h: '1.66'
	},
	{
		symbol: 'EAC',
		price_usd: '0.000807458',
		percent_change_24h: '26.74'
	},
	{
		symbol: 'TUSD',
		price_usd: '0.999948',
		percent_change_24h: '-0.56'
	},
	{
		symbol: 'SNOV',
		price_usd: '0.0233003',
		percent_change_24h: '12.93'
	},
	{
		symbol: 'ENRG',
		price_usd: '0.0771489',
		percent_change_24h: '3.99'
	},
	{
		symbol: 'FLO',
		price_usd: '0.0654117',
		percent_change_24h: '2.94'
	},
	{
		symbol: 'WCT',
		price_usd: '0.932898',
		percent_change_24h: '5.34'
	},
	{
		symbol: 'DEB',
		price_usd: '0.0559727',
		percent_change_24h: '12.52'
	},
	{
		symbol: 'DBET',
		price_usd: '0.0769842',
		percent_change_24h: '5.07'
	},
	{
		symbol: 'AUR',
		price_usd: '1.06559',
		percent_change_24h: '4.49'
	},
	{
		symbol: 'KRM',
		price_usd: '0.0091729',
		percent_change_24h: '19.28'
	},
	{
		symbol: 'CTR',
		price_usd: '0.135324',
		percent_change_24h: '-55.9'
	},
	{
		symbol: 'TFD',
		price_usd: '0.0217656',
		percent_change_24h: '0.54'
	},
	{
		symbol: 'HMC',
		price_usd: '0.0224984',
		percent_change_24h: '6.07'
	},
	{
		symbol: 'TOA',
		price_usd: '0.00376563',
		percent_change_24h: '6.46'
	},
	{
		symbol: 'EVR',
		price_usd: '0.140951',
		percent_change_24h: '2.0'
	},
	{
		symbol: 'SWT',
		price_usd: '1.09665',
		percent_change_24h: '3.49'
	},
	{
		symbol: 'TX',
		price_usd: '1.39586',
		percent_change_24h: '4.88'
	},
	{
		symbol: 'ZOI',
		price_usd: '0.510306',
		percent_change_24h: '16.93'
	},
	{
		symbol: 'MYB',
		price_usd: '3.17412',
		percent_change_24h: '11.38'
	},
	{
		symbol: 'STX',
		price_usd: '0.20827',
		percent_change_24h: '7.92'
	},
	{
		symbol: 'MDT',
		price_usd: '0.0538632',
		percent_change_24h: '-2.6'
	},
	{
		symbol: 'ATB',
		price_usd: '0.211187',
		percent_change_24h: '5.46'
	},
	{
		symbol: 'ATN',
		price_usd: '0.402519',
		percent_change_24h: '1.7'
	},
	{
		symbol: 'IFT',
		price_usd: '0.0450237',
		percent_change_24h: '24.38'
	},
	{
		symbol: 'COFI',
		price_usd: '0.0501853',
		percent_change_24h: '1.8'
	},
	{
		symbol: 'GAM',
		price_usd: '7.1228',
		percent_change_24h: '15.08'
	},
	{
		symbol: 'OK',
		price_usd: '0.115195',
		percent_change_24h: '8.42'
	},
	{
		symbol: 'ERO',
		price_usd: '0.0455782',
		percent_change_24h: '8.52'
	},
	{
		symbol: 'FDX',
		price_usd: '0.0806946',
		percent_change_24h: '12.71'
	},
	{
		symbol: 'EKO',
		price_usd: '0.0338479',
		percent_change_24h: '6.4'
	},
	{
		symbol: 'CHP',
		price_usd: '0.0515752',
		percent_change_24h: '5.17'
	},
	{
		symbol: 'HKN',
		price_usd: '2.05501',
		percent_change_24h: '10.68'
	},
	{
		symbol: 'CHIPS',
		price_usd: '0.397364',
		percent_change_24h: '26.77'
	},
	{
		symbol: 'NEOS',
		price_usd: '2.2028',
		percent_change_24h: '9.79'
	},
	{
		symbol: 'HGT',
		price_usd: '0.0312505',
		percent_change_24h: '9.14'
	},
	{
		symbol: 'TCT',
		price_usd: '0.0170893',
		percent_change_24h: '3.53'
	},
	{
		symbol: 'TCC',
		price_usd: '0.0496953',
		percent_change_24h: '5.9'
	},
	{
		symbol: 'UCASH',
		price_usd: '0.0044328',
		percent_change_24h: '-38.54'
	},
	{
		symbol: 'QAU',
		price_usd: '0.108237',
		percent_change_24h: '1.21'
	},
	{
		symbol: 'DRT',
		price_usd: '0.0136814',
		percent_change_24h: '0.35'
	},
	{
		symbol: 'XSPEC',
		price_usd: '0.387223',
		percent_change_24h: '2.97'
	},
	{
		symbol: 'SPF',
		price_usd: '0.153725',
		percent_change_24h: '17.72'
	},
	{
		symbol: 'PLBT',
		price_usd: '2.01268',
		percent_change_24h: '13.33'
	},
	{
		symbol: 'DBIX',
		price_usd: '3.57603',
		percent_change_24h: '6.31'
	},
	{
		symbol: 'XMY',
		price_usd: '0.00506691',
		percent_change_24h: '10.91'
	},
	{
		symbol: 'AXP',
		price_usd: '0.0308226',
		percent_change_24h: '12.24'
	},
	{
		symbol: 'CVCOIN',
		price_usd: '0.800457',
		percent_change_24h: '43.48'
	},
	{
		symbol: 'HEAT',
		price_usd: '0.235777',
		percent_change_24h: '16.18'
	},
	{
		symbol: 'GCN',
		price_usd: '0.0000509966',
		percent_change_24h: '354.74'
	},
	{
		symbol: 'PST',
		price_usd: '0.152789',
		percent_change_24h: '-2.79'
	},
	{
		symbol: 'DIM',
		price_usd: '0.00370552',
		percent_change_24h: '-15.63'
	},
	{
		symbol: 'CSNO',
		price_usd: '0.110108',
		percent_change_24h: '-0.73'
	},
	{
		symbol: 'PTOY',
		price_usd: '0.10943',
		percent_change_24h: '7.33'
	},
	{
		symbol: 'MUSIC',
		price_usd: '0.0109304',
		percent_change_24h: '4.84'
	},
	{
		symbol: 'PUT',
		price_usd: '0.215551',
		percent_change_24h: '15.71'
	},
	{
		symbol: 'BQ',
		price_usd: '0.00242786',
		percent_change_24h: '-1.13'
	},
	{
		symbol: 'AIR',
		price_usd: '0.00714034',
		percent_change_24h: '-0.81'
	},
	{
		symbol: 'AURA',
		price_usd: '0.0733448',
		percent_change_24h: '6.05'
	},
	{
		symbol: 'GOLOS',
		price_usd: '0.0598166',
		percent_change_24h: '0.05'
	},
	{
		symbol: 'MINT',
		price_usd: '0.000298185',
		percent_change_24h: '-13.48'
	},
	{
		symbol: 'HAC',
		price_usd: '0.0227556',
		percent_change_24h: '-0.02'
	},
	{
		symbol: 'TIME',
		price_usd: '10.3494',
		percent_change_24h: '5.34'
	},
	{
		symbol: 'GBX',
		price_usd: '6.40299',
		percent_change_24h: '20.49'
	},
	{
		symbol: 'XLR',
		price_usd: '6.41649',
		percent_change_24h: '12.97'
	},
	{
		symbol: 'EMV',
		price_usd: '1.1112',
		percent_change_24h: '8.07'
	},
	{
		symbol: 'HBT',
		price_usd: '0.535412',
		percent_change_24h: '-2.22'
	},
	{
		symbol: 'DYN',
		price_usd: '1.49137',
		percent_change_24h: '6.05'
	},
	{
		symbol: 'LOC',
		price_usd: '0.777417',
		percent_change_24h: '12.71'
	},
	{
		symbol: 'NXC',
		price_usd: '0.108343',
		percent_change_24h: '7.67'
	},
	{
		symbol: 'EZT',
		price_usd: '0.625583',
		percent_change_24h: '5.75'
	},
	{
		symbol: 'LUX',
		price_usd: '5.08201',
		percent_change_24h: '9.18'
	},
	{
		symbol: 'POLIS',
		price_usd: '4.61272',
		percent_change_24h: '7.61'
	},
	{
		symbol: 'BCC',
		price_usd: '0.757605',
		percent_change_24h: '-5.41'
	},
	{
		symbol: 'WRC',
		price_usd: '0.0403562',
		percent_change_24h: '9.2'
	},
	{
		symbol: 'COLX',
		price_usd: '0.000657239',
		percent_change_24h: '-1.4'
	},
	{
		symbol: 'RNT',
		price_usd: '0.0314241',
		percent_change_24h: '-1.42'
	},
	{
		symbol: 'PND',
		price_usd: '0.000214742',
		percent_change_24h: '5.61'
	},
	{
		symbol: 'OXY',
		price_usd: '0.0710933',
		percent_change_24h: '1.0'
	},
	{
		symbol: 'NVC',
		price_usd: '3.36215',
		percent_change_24h: '4.56'
	},
	{
		symbol: 'TIE',
		price_usd: '0.166924',
		percent_change_24h: '2.33'
	},
	{
		symbol: 'ARY',
		price_usd: '0.099085',
		percent_change_24h: '4.5'
	},
	{
		symbol: 'GETX',
		price_usd: '0.0225211',
		percent_change_24h: '26.42'
	}
];
