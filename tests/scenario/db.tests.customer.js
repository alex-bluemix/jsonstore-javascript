/*global test, module, deepEqual, ok, start, stop, notDeepEqual*/
(function() {

	'use strict';

	//Dependencies:
	var model = JSONStore;

	var modelInstance;
	var testData;

	function customerData100(){
		return {
			schema : {'firstname': 'string', 'lastname' : 'string', 'address.city' : 'string', 'address.state': 'string'},
			collection : 'scenCust',
			data : [{'lastcalldate': '2012-07-10', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['GE Dryer', 'Sony Mixer', 'GE Utrawave'], 'address': {'city': 'custer', 'state': 'al', 'localphone': '5026741'}, 'customerId': '5f63cd63-01a0-49f2-bcdb-44f433af387c'}, {'lastcalldate': '2012-06-14', 'firstname': 'Molar', 'lastname': 'Addar', 'products': ['GE Utrawave', 'GE Dryer', 'Frigidaire'], 'address': {'city': 'austin', 'state': 'as', 'localphone': '5026741'}, 'customerId': 'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'}, {'lastcalldate': '2012-05-16', 'firstname': 'Diana', 'lastname': 'Kwo', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'woods', 'state': 'pa', 'localphone': '2959331'}, 'customerId': '4e2dc78a-7b65-4af9-9594-f3d82c43680b'}, {'lastcalldate': '2012-06-03', 'firstname': 'Diana', 'lastname': 'Gikil', 'products': ['Frigidaire', 'GE Utrawave', 'GE Utrawave'], 'address': {'city': 'custer', 'state': 'ar', 'localphone': '2703825'}, 'customerId': 'f7bc78aa-1050-4ac9-a500-455a30031810'}, {'lastcalldate': '2012-07-26', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirpool Dishwasher', 'GE Dryer'], 'address': {'city': 'dallas', 'state': 'tn', 'localphone': '1368500'}, 'customerId': '2e106165-e75f-406a-b9af-821600b1e446'}, {'lastcalldate': '2012-06-04', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['GE Dryer', 'Frigidaire'], 'address': {'city': 'dallas', 'state': 'al', 'localphone': '4110441'}, 'customerId': '34b62fc2-5662-42d9-9f40-36fe50c6fdc4'}, {'lastcalldate': '2012-06-07', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'austin', 'state': 'ar', 'localphone': '4229777'}, 'customerId': '374f00d6-7570-4c7f-aace-9c1f5ab7d68b'}, {'lastcalldate': '2012-06-11', 'firstname': 'Athena', 'lastname': 'Kwo', 'products': ['Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'woods', 'state': 'ar', 'localphone': '6971171'}, 'customerId': '5b01a94a-7939-406e-bc1f-5f2c2454f27a'}, {'lastcalldate': '2012-06-01', 'firstname': 'Fama', 'lastname': 'Kwo', 'products': ['Whirlpool Washer', 'GE Utrawave', 'GE Utrawave'], 'address': {'city': 'custer', 'state': 'tn', 'localphone': '4796763'}, 'customerId': 'd490c15e-d0f3-4b6d-a8d0-7a60c752cc32'}, {'lastcalldate': '2012-07-05', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['GE Dryer'], 'address': {'city': 'dallas', 'state': 'ar', 'localphone': '7278994'}, 'customerId': 'e4129219-957d-4abe-a127-457b594eac0f'}, {'lastcalldate': '2012-07-21', 'firstname': 'Fama', 'lastname': 'Kwo', 'products': ['Whirpool Dishwasher', 'Frigidaire', 'Frigidaire'], 'address': {'city': 'dallas', 'state': 'al', 'localphone': '1729103'}, 'customerId': 'eed3e236-dc3d-42c6-95e4-d2f3f062c838'}, {'lastcalldate': '2012-07-23', 'firstname': 'Fama', 'lastname': 'Addar', 'products': ['Sony Mixer'], 'address': {'city': 'custer', 'state': 'ar', 'localphone': '2598380'}, 'customerId': '5b01a94a-7939-406e-bc1f-5f2c2454f27a'}, {'lastcalldate': '2012-06-16', 'firstname': 'Molar', 'lastname': 'Addar', 'products': ['Whirpool Dishwasher', 'Whirlpool Washer'], 'address': {'city': 'london', 'state': 'pa', 'localphone': '6217452'}, 'customerId': 'f7bc78aa-1050-4ac9-a500-455a30031810'}, {'lastcalldate': '2012-06-10', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirlpool Washer', 'Whirlpool Washer'], 'address': {'city': 'custer', 'state': 'ca', 'localphone': '6425286'}, 'customerId': '3d7d9de7-24c0-4d13-86c6-95d6349196b7'}, {'lastcalldate': '2012-05-20', 'firstname': 'Molar', 'lastname': 'Stres', 'products': ['Frigidaire', 'Sony Mixer', 'Frigidaire'], 'address': {'city': 'berlin', 'state': 'tn', 'localphone': '2246588'}, 'customerId': 'b696274c-054e-400a-8d32-082a6a9f295a'}, {'lastcalldate': '2012-07-15', 'firstname': 'Diana', 'lastname': 'Kwo', 'products': ['Sony Mixer', 'Whirpool Dishwasher'], 'address': {'city': 'custer', 'state': 'pa', 'localphone': '2959000'}, 'customerId': 'f7bc78aa-1050-4ac9-a500-455a30031810'}, {'lastcalldate': '2012-06-05', 'firstname': 'Molar', 'lastname': 'Biglar', 'products': ['Frigidaire', 'Sony Mixer', 'Whirpool Dishwasher'], 'address': {'city': 'austin', 'state': 'ar', 'localphone': '6971171'}, 'customerId': '412a6d85-f168-47c7-98a5-d7b6752aae14'}, {'lastcalldate': '2012-08-08', 'firstname': 'Bala', 'lastname': 'Gikil', 'products': ['Frigidaire', 'Whirpool Dishwasher'], 'address': {'city': 'york', 'state': 'ar', 'localphone': '6217452'}, 'customerId': '1402bb00-2d30-4fa0-af2e-d6c689d252ce'}, {'lastcalldate': '2012-05-27', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['Frigidaire', 'Frigidaire', 'Whirpool Dishwasher'], 'address': {'city': 'york', 'state': 'tn', 'localphone': '4163363'}, 'customerId': '92d9c14f-45a2-4ddd-848f-526c7c5485f1'}, {'lastcalldate': '2012-06-11', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Frigidaire'], 'address': {'city': 'berlin', 'state': 'nj', 'localphone': '2412803'}, 'customerId': 'd593d254-1eb7-4c9c-9ab3-23c851066255'}, {'lastcalldate': '2012-07-05', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['Whirpool Dishwasher', 'Sony Mixer', 'Whirlpool Washer'], 'address': {'city': 'woods', 'state': 'nj', 'localphone': '7292787'}, 'customerId': '35865905-a75b-49ac-8205-d913fd12cb9b'}, {'lastcalldate': '2012-06-17', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['Whirpool Dishwasher', 'GE Utrawave', 'Frigidaire'], 'address': {'city': 'custer', 'state': 'tx', 'localphone': '4262537'}, 'customerId': 'e643b276-c8a4-4eaf-a33a-f895bd1faf2e'}, {'lastcalldate': '2012-06-06', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'london', 'state': 'nj', 'localphone': '2598380'}, 'customerId': '1bfe8a56-cd26-4666-9b31-a47237529e2f'}, {'lastcalldate': '2012-07-30', 'firstname': 'Fama', 'lastname': 'Addar', 'products': ['Frigidaire', 'Sony Mixer'], 'address': {'city': 'austin', 'state': 'tn', 'localphone': '1262216'}, 'customerId': '059fc485-4cb8-49a7-bca4-0b2868200d12'}, {'lastcalldate': '2012-06-03', 'firstname': 'Molar', 'lastname': 'Addar', 'products': ['Whirlpool Washer'], 'address': {'city': 'york', 'state': 'pa', 'localphone': '6307071'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-06-15', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['Frigidaire', 'Frigidaire'], 'address': {'city': 'custer', 'state': 'pa', 'localphone': '5362529'}, 'customerId': '0f03097e-5c53-4999-86ad-e2a19ab7653e'}, {'lastcalldate': '2012-07-26', 'firstname': 'Fama', 'lastname': 'Biglar', 'products': ['Whirlpool Washer'], 'address': {'city': 'berlin', 'state': 'nj', 'localphone': '5003631'}, 'customerId': 'f49f1708-d086-48a4-8316-29b50be97145'}, {'lastcalldate': '2012-06-19', 'firstname': 'Fama', 'lastname': 'Addar', 'products': ['Whirlpool Washer'], 'address': {'city': 'york', 'state': 'pa', 'localphone': '4365268'}, 'customerId': 'c0a4349d-6c95-4d81-8653-29c342102a7f'}, {'lastcalldate': '2012-07-15', 'firstname': 'Molar', 'lastname': 'Addar', 'products': ['Sony Mixer'], 'address': {'city': 'london', 'state': 'pa', 'localphone': '3349924'}, 'customerId': '7a9dd39b-3a53-4052-9029-ea19edf5df07'}, {'lastcalldate': '2012-08-04', 'firstname': 'Diana', 'lastname': 'Kwo', 'products': ['Whirlpool Washer'], 'address': {'city': 'woods', 'state': 'nj', 'localphone': '7299946'}, 'customerId': 'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'}, {'lastcalldate': '2012-05-25', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['Sony Mixer', 'Whirlpool Washer'], 'address': {'city': 'dallas', 'state': 'ca', 'localphone': '2703825'}, 'customerId': '548557be-9ae0-452a-99f9-6bdb5499d51f'}, {'lastcalldate': '2012-07-19', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'berlin', 'state': 'ca', 'localphone': '1423392'}, 'customerId': '2cae3129-495d-48e3-b1b2-340c089fc6ab'}, {'lastcalldate': '2012-07-20', 'firstname': 'Athena', 'lastname': 'Gikil', 'products': ['Sony Mixer'], 'address': {'city': 'dallas', 'state': 'as', 'localphone': '3700110'}, 'customerId': '9482ed69-4f00-4aa5-9325-eeed75c96ea9'}, {'lastcalldate': '2012-06-13', 'firstname': 'Molar', 'lastname': 'Stres', 'products': ['GE Utrawave'], 'address': {'city': 'dallas', 'state': 'co', 'localphone': '1797599'}, 'customerId': '412a6d85-f168-47c7-98a5-d7b6752aae14'}, {'lastcalldate': '2012-05-26', 'firstname': 'Athena', 'lastname': 'Biglar', 'products': ['Sony Mixer', 'GE Utrawave', 'Sony Mixer'], 'address': {'city': 'dallas', 'state': 'al', 'localphone': '5855739'}, 'customerId': '315e9056-9e91-4544-854a-2749c01d3516'}, {'lastcalldate': '2012-07-22', 'firstname': 'Fama', 'lastname': 'Gikil', 'products': ['Sony Mixer', 'Sony Mixer', 'Frigidaire'], 'address': {'city': 'dallas', 'state': 'tn', 'localphone': '1797599'}, 'customerId': '315e9056-9e91-4544-854a-2749c01d3516'}, {'lastcalldate': '2012-06-16', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['GE Utrawave', 'Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'dallas', 'state': 'nj', 'localphone': '4262537'}, 'customerId': '5f63cd63-01a0-49f2-bcdb-44f433af387c'}, {'lastcalldate': '2012-06-04', 'firstname': 'Fama', 'lastname': 'Gikil', 'products': ['Frigidaire', 'Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'dallas', 'state': 'tx', 'localphone': '1854206'}, 'customerId': '2cae3129-495d-48e3-b1b2-340c089fc6ab'}, {'lastcalldate': '2012-06-03', 'firstname': 'Bala', 'lastname': 'Gikil', 'products': ['GE Dryer', 'Whirpool Dishwasher'], 'address': {'city': 'london', 'state': 'ar', 'localphone': '4848494'}, 'customerId': '3ef9592d-af9a-491d-92ee-9986bca3bc7a'}, {'lastcalldate': '2012-08-03', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['Sony Mixer', 'Whirlpool Washer', 'Sony Mixer'], 'address': {'city': 'dallas', 'state': 'ca', 'localphone': '4439026'}, 'customerId': '33ac09c1-5114-4f84-a441-10a120cfc4d9'}, {'lastcalldate': '2012-06-26', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Whirlpool Washer'], 'address': {'city': 'london', 'state': 'ny', 'localphone': '5575167'}, 'customerId': '410923ba-c5f6-4aa3-a5fe-b4892b4f89f3'}, {'lastcalldate': '2012-06-29', 'firstname': 'Fama', 'lastname': 'Biglar', 'products': ['GE Dryer', 'Sony Mixer'], 'address': {'city': 'custer', 'state': 'tn', 'localphone': '5230608'}, 'customerId': '548557be-9ae0-452a-99f9-6bdb5499d51f'}, {'lastcalldate': '2012-06-22', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['Whirlpool Washer'], 'address': {'city': 'york', 'state': 'tx', 'localphone': '4716966'}, 'customerId': 'eed3e236-dc3d-42c6-95e4-d2f3f062c838'}, {'lastcalldate': '2012-05-31', 'firstname': 'Athena', 'lastname': 'Kwo', 'products': ['GE Utrawave', 'Sony Mixer', 'GE Utrawave'], 'address': {'city': 'berlin', 'state': 'nj', 'localphone': '7278994'}, 'customerId': '410923ba-c5f6-4aa3-a5fe-b4892b4f89f3'}, {'lastcalldate': '2012-05-12', 'firstname': 'Molar', 'lastname': 'Kwo', 'products': ['GE Dryer', 'GE Utrawave', 'Whirpool Dishwasher'], 'address': {'city': 'austin', 'state': 'ca', 'localphone': '3379518'}, 'customerId': '929fefc7-fb02-49dd-be8b-9e1043aed661'}, {'lastcalldate': '2012-07-29', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['GE Dryer', 'Frigidaire'], 'address': {'city': 'york', 'state': 'co', 'localphone': '7635794'}, 'customerId': '35865905-a75b-49ac-8205-d913fd12cb9b'}, {'lastcalldate': '2012-07-05', 'firstname': 'Molar', 'lastname': 'Kwo', 'products': ['Frigidaire', 'GE Utrawave', 'Whirlpool Washer'], 'address': {'city': 'woods', 'state': 'ar', 'localphone': '1439078'}, 'customerId': 'ce5e7059-a38a-4274-9acc-d25037905176'}, {'lastcalldate': '2012-05-13', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['Sony Mixer', 'Whirlpool Washer'], 'address': {'city': 'custer', 'state': 'nj', 'localphone': '6248347'}, 'customerId': '131f3b66-902d-46b9-b442-ef4741664fac'}, {'lastcalldate': '2012-05-16', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Whirpool Dishwasher'], 'address': {'city': 'york', 'state': 'pa', 'localphone': '6615511'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-06-14', 'firstname': 'Athena', 'lastname': 'Addar', 'products': ['GE Dryer'], 'address': {'city': 'austin', 'state': 'tn', 'localphone': '4733902'}, 'customerId': 'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'}, {'lastcalldate': '2012-06-29', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirlpool Washer', 'Frigidaire', 'Frigidaire'], 'address': {'city': 'york', 'state': 'tx', 'localphone': '1439078'}, 'customerId': 'f7bc78aa-1050-4ac9-a500-455a30031810'}, {'lastcalldate': '2012-06-23', 'firstname': 'Diana', 'lastname': 'Kwo', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'dallas', 'state': 'tn', 'localphone': '6582959'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-06-30', 'firstname': 'Fama', 'lastname': 'Biglar', 'products': ['Whirlpool Washer', 'Frigidaire'], 'address': {'city': 'woods', 'state': 'nj', 'localphone': '1691630'}, 'customerId': '92d9c14f-45a2-4ddd-848f-526c7c5485f1'}, {'lastcalldate': '2012-06-27', 'firstname': 'Bala', 'lastname': 'Biglar', 'products': ['Frigidaire', 'Whirpool Dishwasher', 'Whirpool Dishwasher'], 'address': {'city': 'york', 'state': 'nj', 'localphone': '6067877'}, 'customerId': 'e4129219-957d-4abe-a127-457b594eac0f'}, {'lastcalldate': '2012-07-07', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['GE Dryer', 'Sony Mixer', 'Whirpool Dishwasher'], 'address': {'city': 'custer', 'state': 'ar', 'localphone': '6217452'}, 'customerId': 'c58a2af2-dc75-4301-a2e9-234a64ebd3b2'}, {'lastcalldate': '2012-06-15', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirlpool Washer'], 'address': {'city': 'dallas', 'state': 'nj', 'localphone': '6220387'}, 'customerId': '374f00d6-7570-4c7f-aace-9c1f5ab7d68b'}, {'lastcalldate': '2012-05-13', 'firstname': 'Fama', 'lastname': 'Biglar', 'products': ['Sony Mixer', 'Sony Mixer'], 'address': {'city': 'berlin', 'state': 'ny', 'localphone': '7305221'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-06-10', 'firstname': 'Athena', 'lastname': 'Biglar', 'products': ['Frigidaire', 'Whirpool Dishwasher', 'Whirpool Dishwasher'], 'address': {'city': 'custer', 'state': 'ca', 'localphone': '2070472'}, 'customerId': 'b696274c-054e-400a-8d32-082a6a9f295a'}, {'lastcalldate': '2012-05-30', 'firstname': 'Molar', 'lastname': 'Biglar', 'products': ['GE Dryer'], 'address': {'city': 'york', 'state': 'pa', 'localphone': '6684925'}, 'customerId': '1bfe8a56-cd26-4666-9b31-a47237529e2f'}, {'lastcalldate': '2012-08-08', 'firstname': 'Fama', 'lastname': 'Kwo', 'products': ['GE Dryer', 'Whirpool Dishwasher'], 'address': {'city': 'woods', 'state': 'al', 'localphone': '5003631'}, 'customerId': '4c8576e9-f258-4d78-8c26-c8ce15f16f1c'}, {'lastcalldate': '2012-07-17', 'firstname': 'Molar', 'lastname': 'Stres', 'products': ['Whirpool Dishwasher', 'Frigidaire', 'GE Dryer'], 'address': {'city': 'dallas', 'state': 'ar', 'localphone': '5855739'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-07-31', 'firstname': 'Athena', 'lastname': 'Gikil', 'products': ['GE Utrawave'], 'address': {'city': 'custer', 'state': 'pa', 'localphone': '6610298'}, 'customerId': '7a9dd39b-3a53-4052-9029-ea19edf5df07'}, {'lastcalldate': '2012-07-16', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['GE Dryer', 'GE Utrawave'], 'address': {'city': 'custer', 'state': 'ny', 'localphone': '4039949'}, 'customerId': '131f3b66-902d-46b9-b442-ef4741664fac'}, {'lastcalldate': '2012-06-22', 'firstname': 'Diana', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Sony Mixer', 'Whirpool Dishwasher'], 'address': {'city': 'berlin', 'state': 'ar', 'localphone': '3035332'}, 'customerId': '55b45e2a-ad4c-4cbe-8673-9ceeeaf361e8'}, {'lastcalldate': '2012-07-18', 'firstname': 'Diana', 'lastname': 'Kwo', 'products': ['GE Dryer', 'Whirpool Dishwasher', 'Whirpool Dishwasher'], 'address': {'city': 'berlin', 'state': 'ca', 'localphone': '1368500'}, 'customerId': '571b75ca-3167-4fac-80ef-e6aa764e1b6e'}, {'lastcalldate': '2012-07-16', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Frigidaire'], 'address': {'city': 'dallas', 'state': 'tn', 'localphone': '1797599'}, 'customerId': '7afbba6d-f0c4-435f-ab9a-10d4969eae4d'}, {'lastcalldate': '2012-08-05', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['GE Dryer', 'Sony Mixer', 'GE Dryer'], 'address': {'city': 'berlin', 'state': 'ar', 'localphone': '6684925'}, 'customerId': 'bd573671-90f3-44f2-9248-9d6366535973'}, {'lastcalldate': '2012-07-09', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirlpool Washer', 'Sony Mixer'], 'address': {'city': 'dallas', 'state': 'nj', 'localphone': '6425286'}, 'customerId': '17e2272a-4f77-47cd-820b-bafbaffec37f'}, {'lastcalldate': '2012-08-01', 'firstname': 'Fama', 'lastname': 'Kwo', 'products': ['Sony Mixer', 'Whirpool Dishwasher', 'Whirlpool Washer'], 'address': {'city': 'berlin', 'state': 'ar', 'localphone': '6067877'}, 'customerId': '282d6593-d229-451c-b80a-903d8a74e36c'}, {'lastcalldate': '2012-06-02', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['Frigidaire'], 'address': {'city': 'berlin', 'state': 'as', 'localphone': '4262537'}, 'customerId': '8055814f-cd18-4d30-8130-b4bdc2ad35f8'}, {'lastcalldate': '2012-06-09', 'firstname': 'Fama', 'lastname': 'Biglar', 'products': ['Whirlpool Washer', 'Whirlpool Washer', 'Frigidaire'], 'address': {'city': 'berlin', 'state': 'ca', 'localphone': '4392043'}, 'customerId': 'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'}, {'lastcalldate': '2012-05-27', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['Frigidaire', 'Whirpool Dishwasher', 'Whirlpool Washer'], 'address': {'city': 'dallas', 'state': 'tn', 'localphone': '6248347'}, 'customerId': 'c0a4349d-6c95-4d81-8653-29c342102a7f'}, {'lastcalldate': '2012-06-24', 'firstname': 'Bala', 'lastname': 'Stres', 'products': ['Whirpool Dishwasher', 'Whirlpool Washer'], 'address': {'city': 'austin', 'state': 'al', 'localphone': '6239747'}, 'customerId': '5b692f08-9079-4971-ae57-3dd3f6ae2607'}, {'lastcalldate': '2012-07-17', 'firstname': 'Bala', 'lastname': 'Gikil', 'products': ['Frigidaire', 'Frigidaire', 'Frigidaire'], 'address': {'city': 'berlin', 'state': 'nj', 'localphone': '7278994'}, 'customerId': '17e2272a-4f77-47cd-820b-bafbaffec37f'}, {'lastcalldate': '2012-05-20', 'firstname': 'Athena', 'lastname': 'Gikil', 'products': ['Whirpool Dishwasher', 'Whirlpool Washer', 'Frigidaire'], 'address': {'city': 'woods', 'state': 'tx', 'localphone': '2520143'}, 'customerId': '3d7d9de7-24c0-4d13-86c6-95d6349196b7'}, {'lastcalldate': '2012-06-28', 'firstname': 'Athena', 'lastname': 'Gikil', 'products': ['Whirpool Dishwasher', 'GE Dryer'], 'address': {'city': 'austin', 'state': 'nj', 'localphone': '2595481'}, 'customerId': 'c58a2af2-dc75-4301-a2e9-234a64ebd3b2'}, {'lastcalldate': '2012-05-31', 'firstname': 'Molar', 'lastname': 'Kwo', 'products': ['Whirlpool Washer', 'Sony Mixer', 'Whirlpool Washer'], 'address': {'city': 'berlin', 'state': 'pa', 'localphone': '1456410'}, 'customerId': '2cae3129-495d-48e3-b1b2-340c089fc6ab'}, {'lastcalldate': '2012-07-20', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['Whirlpool Washer', 'Sony Mixer'], 'address': {'city': 'dallas', 'state': 'ny', 'localphone': '6512413'}, 'customerId': '4c8576e9-f258-4d78-8c26-c8ce15f16f1c'}, {'lastcalldate': '2012-07-06', 'firstname': 'Diana', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Frigidaire', 'Sony Mixer'], 'address': {'city': 'berlin', 'state': 'ny', 'localphone': '7201665'}, 'customerId': '131de1bb-0d51-4560-aa36-80a427e48fe6'}, {'lastcalldate': '2012-07-22', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['Sony Mixer'], 'address': {'city': 'austin', 'state': 'tn', 'localphone': '6010834'}, 'customerId': '97271021-30d9-49de-b85d-74c7943ddde1'}, {'lastcalldate': '2012-05-23', 'firstname': 'Bala', 'lastname': 'Addar', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'austin', 'state': 'pa', 'localphone': '4163363'}, 'customerId': '3d73d2b9-3aff-496d-bf0e-bf223f89bb14'}, {'lastcalldate': '2012-06-12', 'firstname': 'Fama', 'lastname': 'Gikil', 'products': ['Sony Mixer'], 'address': {'city': 'woods', 'state': 'nj', 'localphone': '2121181'}, 'customerId': 'b696274c-054e-400a-8d32-082a6a9f295a'}, {'lastcalldate': '2012-05-30', 'firstname': 'Bala', 'lastname': 'Biglar', 'products': ['Frigidaire'], 'address': {'city': 'london', 'state': 'ca', 'localphone': '1797599'}, 'customerId': '0e1dce75-4a70-41d2-b775-1ca7ffe1e29f'}, {'lastcalldate': '2012-05-26', 'firstname': 'Bala', 'lastname': 'Gikil', 'products': ['GE Dryer', 'Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'custer', 'state': 'tx', 'localphone': '4365268'}, 'customerId': '8055814f-cd18-4d30-8130-b4bdc2ad35f8'}, {'lastcalldate': '2012-08-02', 'firstname': 'Molar', 'lastname': 'Gikil', 'products': ['Whirlpool Washer', 'Sony Mixer'], 'address': {'city': 'woods', 'state': 'pa', 'localphone': '1780295'}, 'customerId': 'eed3e236-dc3d-42c6-95e4-d2f3f062c838'}, {'lastcalldate': '2012-05-29', 'firstname': 'Fama', 'lastname': 'Stres', 'products': ['Frigidaire', 'Whirpool Dishwasher'], 'address': {'city': 'woods', 'state': 'pa', 'localphone': '1878647'}, 'customerId': '8002884d-ce2f-429f-8e8f-a5ac7683c163'}, {'lastcalldate': '2012-05-30', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['GE Utrawave', 'Whirpool Dishwasher'], 'address': {'city': 'woods', 'state': 'pa', 'localphone': '4365268'}, 'customerId': 'b696274c-054e-400a-8d32-082a6a9f295a'}, {'lastcalldate': '2012-06-23', 'firstname': 'Bala', 'lastname': 'Gikil', 'products': ['Frigidaire', 'Sony Mixer'], 'address': {'city': 'berlin', 'state': 'ca', 'localphone': '6480037'}, 'customerId': '3f2e46ec-65bf-4701-a0c3-f87f3f57a879'}, {'lastcalldate': '2012-06-11', 'firstname': 'Molar', 'lastname': 'Kwo', 'products': ['Whirlpool Washer', 'Sony Mixer', 'GE Utrawave'], 'address': {'city': 'austin', 'state': 'ca', 'localphone': '3160110'}, 'customerId': '131f3b66-902d-46b9-b442-ef4741664fac'}, {'lastcalldate': '2012-07-30', 'firstname': 'Athena', 'lastname': 'Kwo', 'products': ['Whirpool Dishwasher'], 'address': {'city': 'london', 'state': 'ny', 'localphone': '7305221'}, 'customerId': '7546f72e-c156-4644-9c23-b014fb446aec'}, {'lastcalldate': '2012-06-28', 'firstname': 'Diana', 'lastname': 'Stres', 'products': ['Whirlpool Washer', 'Frigidaire', 'Sony Mixer'], 'address': {'city': 'custer', 'state': 'as', 'localphone': '2959000'}, 'customerId': '3f2e46ec-65bf-4701-a0c3-f87f3f57a879'}, {'lastcalldate': '2012-05-18', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['Sony Mixer', 'GE Utrawave'], 'address': {'city': 'austin', 'state': 'nj', 'localphone': '2598380'}, 'customerId': '5b01a94a-7939-406e-bc1f-5f2c2454f27a'}, {'lastcalldate': '2012-07-22', 'firstname': 'Bala', 'lastname': 'Biglar', 'products': ['GE Dryer'], 'address': {'city': 'woods', 'state': 'pa', 'localphone': '1691630'}, 'customerId': 'ba854b9d-05f9-4cbc-ae52-5c18095fd56e'}, {'lastcalldate': '2012-06-05', 'firstname': 'Molar', 'lastname': 'Biglar', 'products': ['GE Dryer', 'Whirpool Dishwasher', 'Sony Mixer'], 'address': {'city': 'custer', 'state': 'nj', 'localphone': '7292787'}, 'customerId': '78f25697-a821-4b6d-84e7-f79dff745073'}, {'lastcalldate': '2012-07-28', 'firstname': 'Athena', 'lastname': 'Stres', 'products': ['GE Utrawave', 'Frigidaire', 'Whirpool Dishwasher'], 'address': {'city': 'woods', 'state': 'ar', 'localphone': '2726448'}, 'customerId': 'f56ca683-008a-4642-a6ba-b5f5bf34b112'}, {'lastcalldate': '2012-06-10', 'firstname': 'Bala', 'lastname': 'Biglar', 'products': ['Frigidaire', 'Whirlpool Washer'], 'address': {'city': 'austin', 'state': 'tx', 'localphone': '2466812'}, 'customerId': '0e1dce75-4a70-41d2-b775-1ca7ffe1e29f'}, {'lastcalldate': '2012-07-25', 'firstname': 'Diana', 'lastname': 'Stres', 'products': ['GE Dryer'], 'address': {'city': 'berlin', 'state': 'al', 'localphone': '6527476'}, 'customerId': '6866b8cd-5977-4b6d-91c8-2ee3b1e0d534'}, {'lastcalldate': '2012-05-23', 'firstname': 'Athena', 'lastname': 'Addar', 'products': ['GE Utrawave', 'GE Utrawave'], 'address': {'city': 'austin', 'state': 'al', 'localphone': '6480037'}, 'customerId': '5f63cd63-01a0-49f2-bcdb-44f433af387c'}, {'lastcalldate': '2012-06-10', 'firstname': 'Athena', 'lastname': 'Addar', 'products': ['Whirpool Dishwasher', 'Sony Mixer'], 'address': {'city': 'austin', 'state': 'ny', 'localphone': '4584791'}, 'customerId': '282d6593-d229-451c-b80a-903d8a74e36c'}, {'lastcalldate': '2012-07-25', 'firstname': 'Diana', 'lastname': 'Biglar', 'products': ['Whirlpool Washer', 'Sony Mixer'], 'address': {'city': 'dallas', 'state': 'al', 'localphone': '4716966'}, 'customerId': 'dafeb126-a60a-4882-806f-701c45138d4c'}],
			newCust :  { 'lastcalldate': '2012-04-10', 'firstname': 'Wayne','lastname': 'Rooney', 'products': ['Sony Mixer', 'GE Dryer', 'GE Utrawave'],'address': {'city': 'austin', 'state': 'tx','localphone': '5126741'},'customerId': '5f63kw63-01a0-49f2-bcdb-44f433af387c'},
			numStored : 100,
			findBala : 24
		};
	}

	testData = customerData100();

	var fail = function (err) {
		ok(false, 'Failed with: ' + err + ' ' + model.getErrorMessage(err));
		start();
	};

	/************************************************

	Start of the more complex customer tests

	**************************************************/
	module('Customer Tests');

	//Create a new model, only to drop it in the next step
	test('Create Model', 1, function(){
		stop();

		var winInit = function(data){
			deepEqual(data, 0, 'new collection');
			start();
		};

		var options = { onSuccess: winInit, onFailure: fail, dropCollection: true};
		modelInstance = JSONStore.initCollection(testData.collection, testData.schema, options);
	});

	test('Store', 1, function() {
		stop();

		var winStore = function(data){
			deepEqual(data, testData.numStored, 'Expected for number of records stored: ' + testData.numStored);
			start();
		};
		//Store the array, it will get parsed by top level elements
		modelInstance.store(testData.data, {onSuccess: winStore, onFailure: fail});
	});

	test('pushRequiredCount', 1, function() {
		stop();

		var winpushRequiredCount = function(data){
			deepEqual(0, data, 'Modification count should be 0');
			start();
		};
		modelInstance.pushRequiredCount({onSuccess: winpushRequiredCount, onFailure: fail});
	});

	test('isPushRequired', 1, function() {
		stop();

		var winisPushRequired = function(data){
			deepEqual(data, 0, 'isPushRequired should have returned 0 ' + data);
			start();
		};

		modelInstance.isPushRequired(1, {onSuccess: winisPushRequired, onFailure: fail});
	});

	test('All Changed', 1, function() {
		stop();

		var winAllChanged = function(data){
			deepEqual(data, [], 'getPushRequired should have returned empty array ' + data);
			start();
		};

		modelInstance.getPushRequired({onSuccess: winAllChanged, onFailure: fail});
	});

	test('Find by string', 1, function() {

		stop();

		var winFind = function(data){
			deepEqual(testData.findBala, data.length, 'Expected matches for firstname Bala: ' +testData.findBala);
			start();
		};

		modelInstance.find({firstname: 'Bala'}, {onSuccess: winFind, onFailure: fail});
	});

	test('Find All', 1, function() {
		stop();

		var winFindAll = function(data){
			deepEqual(testData.numStored, data.length,  'Find all should return : ' + testData.numStored);
			start();
		};

		modelInstance.findAll({onSuccess: winFindAll, onFailure: fail});
	});

	test('Find Bala and Replace him', 50, function() {
		stop();

		var win = function(data){

			var upFin = function (replacedData){
				deepEqual(replacedData, 24, 'Expected an replacement of 1 record');
				start();
			};

			deepEqual(testData.findBala, data.length, 'Expected 24 matches for firstname Bala');

			for (var i = data.length - 1; i >= 0; i--) {
				notDeepEqual(typeof data[i]._id, 'undefined',  'expected an _id element');
				notDeepEqual(typeof data[i].json, 'undefined', 'expected an json element');
				data[i].json.firstname = 'Holla';
			}
			modelInstance.replace(data, {
				onSuccess: upFin,
				onFailure: fail
			});
		};

		modelInstance.find({firstname: 'Bala'}, {onSuccess: win, onFailure: fail});
	});

	test('PushRequired Count', 1, function() {
		stop();

		var winPushRequiredCount = function(data){
			deepEqual(data, testData.findBala, 'Modification count should be 0');
			start();
		};
		modelInstance.pushRequiredCount({onSuccess: winPushRequiredCount, onFailure: fail});
	});


	test('All Changed After Update', 1, function() {
		stop();

		var winGetPushRequired = function(data){
			deepEqual(data.length, testData.findBala, 'getPushRequired lenght of array should match');
			start();
		};

		modelInstance.getPushRequired({onSuccess: winGetPushRequired, onFailure: fail});

	});


	test('Find newly replaced by string', 1, function() {
		stop();

		var winFind = function(data){
			deepEqual(data.length, testData.findBala, 'Expected matches for firstname Holla: ' +testData.findBala);
			start();
		};

		modelInstance.find({firstname: 'Holla'}, {onSuccess: winFind, onFailure: fail});
	});

	test('Delete by query', 1, function() {
		stop();

		var winDeleteByQuery = function(data){
			deepEqual(data, testData.findBala, 'Expected matches for delete firstname Holla: ' +testData.findBala);
			start();
		};

		modelInstance.remove({firstname: 'Holla'}, {onSuccess: winDeleteByQuery, onFailure: fail});
	});

	test('Local Count', 1, function() {
		stop();

		var winPushRequiredCount = function(data){
			deepEqual(data, testData.findBala, 'Modification count should be ' + testData.findBala);
			start();
		};
		modelInstance.pushRequiredCount({onSuccess: winPushRequiredCount, onFailure: fail});
	});

	test('All Changed After Delete', 1, function() {
		stop();

		var winGetPushRequired = function(data){
			deepEqual(data.length, testData.findBala, 'getPushRequired lenght of array should match');
			start();
		};

		modelInstance.getPushRequired({onSuccess: winGetPushRequired, onFailure: fail});

	});

	test('Find All Post Delete', 1, function() {
		stop();

		var winFindAll = function(data){
			deepEqual( (testData.numStored  - testData.findBala) , data.length,  'Find all should return : ' + (testData.numStored  - testData.findBala));
			start();
		};

		modelInstance.find({}, {onSuccess: winFindAll, onFailure: fail});
	});

	test('Add a Customer', 1, function(){
		stop();

		var winAdd = function(data){
			deepEqual(data, 1, 'Add 1 customer');
			start();
		};

		modelInstance.add(testData.newCust, {onSuccess: winAdd, onFailure: fail});
	});

	test('All Changed After Add', 1, function() {
		stop();

		var winGetPushRequired = function(data){
			deepEqual((data.length), (testData.findBala +1),  'getPushRequired length of array should match');
			start();
		};
		modelInstance.getPushRequired({onSuccess: winGetPushRequired, onFailure: fail});

	});

})();