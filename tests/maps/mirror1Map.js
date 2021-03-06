var helper = require('../helper');

module.exports = {
	 /* draws a rather complex map for testing the mirror 1 feature */
	 /* Team Brawl by Slichizard */
	'drawMap': function (test, external) {
		console.log(">> Draw team brawl".purple());
		if (!external) { test.open('index.html'); }

		test
			.waitForElement('#core_p1')
			.click('#impenetrable')
			.click('#col_1_1')
			.click('#col_1_2')
			.click('#col_1_3')
			.click('#col_1_4')
			.click('#col_1_5')
			.click('#col_1_6')
			.click('#col_1_7')
			.click('#col_1_8')
			.click('#col_1_9')
			.click('#col_1_10')
			.click('#col_1_11')
			.click('#col_1_12')
			.click('#col_1_13')
			.click('#col_1_14')
			.click('#col_1_15')
			.click('#col_1_16')
			.click('#col_1_17')
			.click('#col_1_18')
			.click('#col_1_19')
			.click('#col_1_20')
			.click('#col_1_21')
			.click('#col_1_22')
			.click('#col_1_23')
			.click('#col_1_24')
			.click('#col_1_25')
			.click('#col_1_26')
			.click('#col_1_36')
			.click('#col_2_1')
			.click('#col_2_2')
			.click('#col_2_3')
			.click('#col_2_4')
			.click('#col_2_5')
			.click('#col_2_6')
			.click('#col_2_7')
			.click('#col_2_8')
			.click('#col_2_9')
			.click('#col_2_10')
			.click('#col_2_11')
			.click('#col_2_12')
			.click('#col_2_13')
			.click('#col_2_14')
			.click('#col_2_15')
			.click('#col_2_16')
			.click('#col_2_17')
			.click('#col_2_18')
			.click('#col_2_19')
			.click('#col_2_20')
			.click('#col_2_21')
			.click('#col_2_22')
			.click('#col_2_23')
			.click('#col_2_24')
			.click('#col_2_25')
			.click('#col_3_1')
			.click('#col_3_2')
			.click('#col_3_3')
			.click('#col_3_4')
			.click('#col_3_5')
			.click('#col_3_6')
			.click('#col_3_7')
			.click('#col_3_8')
			.click('#col_3_9')
			.click('#col_3_10')
			.click('#col_3_11')
			.click('#col_3_12')
			.click('#col_3_13')
			.click('#col_3_14')
			.click('#col_3_15')
			.click('#col_3_16')
			.click('#col_3_17')
			.click('#col_3_18')
			.click('#col_3_19')
			.click('#col_3_20')
			.click('#col_3_21')
			.click('#col_3_22')
			.click('#col_3_23')
			.click('#col_3_24')
			.click('#col_4_1')
			.click('#col_4_2')
			.click('#col_4_3')
			.click('#col_4_4')
			.click('#col_4_5')
			.click('#col_4_6')
			.click('#col_4_7')
			.click('#col_4_8')
			.click('#col_4_9')
			.click('#col_4_10')
			.click('#col_4_11')
			.click('#col_4_12')
			.click('#col_4_13')
			.click('#col_4_14')
			.click('#col_4_15')
			.click('#col_4_16')
			.click('#col_4_17')
			.click('#col_4_18')
			.click('#col_4_19')
			.click('#col_4_20')
			.click('#col_4_21')
			.click('#col_4_22')
			.click('#col_4_23')
			.click('#col_5_1')
			.click('#col_5_2')
			.click('#col_5_3')
			.click('#col_5_4')
			.click('#col_5_5')
			.click('#col_5_6')
			.click('#col_5_7')
			.click('#col_5_8')
			.click('#col_5_9')
			.click('#col_5_10')
			.click('#col_5_11')
			.click('#col_5_12')
			.click('#col_5_13')
			.click('#col_5_14')
			.click('#col_5_15')
			.click('#col_6_1')
			.click('#col_6_2')
			.click('#col_6_3')
			.click('#col_6_4')
			.click('#col_6_5')
			.click('#col_6_6')
			.click('#col_6_7')
			.click('#col_6_8')
			.click('#col_6_9')
			.click('#col_6_10')
			.click('#col_6_11')
			.click('#col_6_12')
			.click('#col_6_13')
			.click('#col_6_14')
			.click('#col_7_1')
			.click('#col_7_2')
			.click('#col_7_3')
			.click('#col_7_4')
			.click('#col_7_5')
			.click('#col_7_6')
			.click('#col_7_7')
			.click('#col_7_8')
			.click('#col_7_9')
			.click('#col_7_10')
			.click('#col_7_11')
			.click('#col_7_12')
			.click('#col_8_1')
			.click('#col_8_2')
			.click('#col_8_3')
			.click('#col_8_4')
			.click('#col_8_5')
			.click('#col_8_6')
			.click('#col_8_7')
			.click('#col_8_8')
			.click('#col_8_9')
			.click('#col_8_10')
			.click('#col_8_11')
			.click('#col_9_1')
			.click('#col_9_2')
			.click('#col_9_3')
			.click('#col_9_4')
			.click('#col_9_5')
			.click('#col_9_6')
			.click('#col_9_7')
			.click('#col_9_8')
			.click('#col_9_9')
			.click('#col_9_10')
			.click('#col_9_11')
			.click('#col_10_1')
			.click('#col_10_2')
			.click('#col_10_3')
			.click('#col_10_4')
			.click('#col_10_5')
			.click('#col_10_6')
			.click('#col_10_7')
			.click('#col_10_8')
			.click('#col_10_9')
			.click('#col_10_10')
			.click('#col_10_11')
			.click('#col_11_1')
			.click('#col_11_2')
			.click('#col_11_3')
			.click('#col_11_4')
			.click('#col_11_5')
			.click('#col_11_6')
			.click('#col_11_7')
			.click('#col_11_8')
			.click('#col_11_9')
			.click('#col_11_10')
			.click('#col_11_11')
			.click('#col_12_1')
			.click('#col_12_2')
			.click('#col_12_3')
			.click('#col_12_4')
			.click('#col_12_5')
			.click('#col_12_6')
			.click('#col_12_7')
			.click('#col_12_8')
			.click('#col_12_9')
			.click('#col_12_10')
			.click('#col_12_11')
			.click('#col_13_1')
			.click('#col_13_2')
			.click('#col_13_3')
			.click('#col_13_4')
			.click('#col_13_5')
			.click('#col_13_6')
			.click('#col_13_7')
			.click('#col_13_8')
			.click('#col_13_9')
			.click('#col_13_10')
			.click('#col_13_11')
			.click('#col_14_1')
			.click('#col_14_2')
			.click('#col_14_3')
			.click('#col_14_4')
			.click('#col_14_5')
			.click('#col_14_6')
			.click('#col_14_7')
			.click('#col_14_8')
			.click('#col_14_9')
			.click('#col_14_10')
			.click('#col_15_1')
			.click('#col_15_2')
			.click('#col_15_3')
			.click('#col_15_4')
			.click('#col_15_5')
			.click('#col_15_6')
			.click('#col_15_7')
			.click('#col_15_8')
			.click('#col_15_9')
			.click('#col_16_1')
			.click('#col_16_2')
			.click('#col_16_3')
			.click('#col_16_4')
			.click('#col_16_5')
			.click('#col_16_6')
			.click('#col_16_7')
			.click('#col_17_1')
			.click('#col_17_2')
			.click('#col_17_3')
			.click('#col_17_4')
			.click('#col_17_5')
			.click('#col_17_6')
			.click('#col_18_1')
			.click('#col_18_2')
			.click('#col_18_3')
			.click('#col_18_4')
			.click('#col_18_5')
			.click('#col_19_1')
			.click('#col_19_2')
			.click('#col_19_3')
			.click('#col_19_4')
			.click('#col_20_1')
			.click('#col_20_2')
			.click('#col_20_3')
			.click('#col_21_1')
			.click('#col_21_2')
			.click('#col_22_1')
			.click('#col_27_1')
			.click('#col_28_1')
			.click('#col_28_2')
			.click('#col_29_1')
			.click('#col_29_2')
			.click('#col_29_3')
			.click('#col_30_1')
			.click('#col_30_2')
			.click('#col_30_3')
			.click('#col_30_4')
			.click('#col_31_1')
			.click('#col_31_2')
			.click('#col_31_3')
			.click('#col_31_4')
			.click('#col_31_5')
			.click('#col_32_1')
			.click('#col_32_2')
			.click('#col_32_3')
			.click('#col_32_4')
			.click('#col_32_5')
			.click('#col_32_6')
			.click('#col_32_7')
			.click('#col_33_1')
			.click('#col_33_2')
			.click('#col_33_3')
			.click('#col_33_4')
			.click('#col_33_5')
			.click('#col_33_6')
			.click('#col_33_7')
			.click('#col_33_8')
			.click('#col_34_1')
			.click('#col_34_2')
			.click('#col_34_3')
			.click('#col_34_4')
			.click('#col_34_5')
			.click('#col_34_6')
			.click('#col_34_7')
			.click('#col_34_8')
			.click('#col_34_9')
			.click('#col_34_10')
			.click('#col_34_11')
			.click('#col_34_12')
			.click('#col_34_13')
			.click('#col_34_14')
			.click('#col_34_15')
			.click('#col_34_16')
			.click('#col_34_17')
			.click('#col_34_18')
			.click('#col_35_1')
			.click('#col_35_2')
			.click('#col_35_3')
			.click('#col_35_4')
			.click('#col_35_5')
			.click('#col_35_6')
			.click('#col_35_7')
			.click('#col_35_8')
			.click('#col_35_9')
			.click('#col_35_10')
			.click('#col_35_11')
			.click('#col_35_12')
			.click('#col_35_13')
			.click('#col_35_14')
			.click('#col_35_15')
			.click('#col_35_16')
			.click('#col_35_17')
			.click('#col_35_18')
			.click('#col_35_19')
			.click('#col_36_1')
			.click('#col_36_2')
			.click('#col_36_3')
			.click('#col_36_4')
			.click('#col_36_5')
			.click('#col_36_6')
			.click('#col_36_7')
			.click('#col_36_8')
			.click('#col_36_9')
			.click('#col_36_10')
			.click('#col_36_11')
			.click('#col_36_12')
			.click('#col_36_13')
			.click('#col_36_14')
			.click('#col_36_15')
			.click('#col_36_16')
			.click('#col_36_17')
			.click('#col_36_18')
			.click('#col_36_19')
			.click('#col_36_20')
			.click('#col_36_21')
			.click('#col_37_1')
			.click('#col_37_2')
			.click('#col_37_3')
			.click('#col_37_4')
			.click('#col_37_5')
			.click('#col_37_6')
			.click('#col_37_7')
			.click('#col_37_8')
			.click('#col_37_9')
			.click('#col_37_10')
			.click('#col_37_11')
			.click('#col_37_12')
			.click('#col_37_13')
			.click('#col_37_14')
			.click('#col_37_15')
			.click('#col_37_16')
			.click('#col_37_17')
			.click('#col_37_18')
			.click('#col_37_19')
			.click('#col_37_20')
			.click('#col_37_21')
			.click('#col_37_22')
			.click('#col_36_30')
			.click('#col_36_31')
			.click('#col_36_32')
			.click('#col_36_33')
			.click('#col_37_29')
			.click('#col_37_30')
			.click('#col_37_31')
			.click('#col_37_32')
			.click('#col_37_33')
			.click('#col_37_34')
			.click('#lava')
			.click('#col_3_29')
			.click('#col_3_30')
			.click('#col_3_31')
			.click('#col_3_32')
			.click('#col_3_33')
			.click('#col_3_34')
			.click('#col_3_35')
			.click('#col_4_28')
			.click('#col_4_29')
			.click('#col_4_35')
			.click('#col_4_36')
			.click('#col_5_27')
			.click('#col_5_28')
			.click('#col_5_36')
			.click('#col_6_26')
			.click('#col_6_27')
			.click('#col_6_36')
			.click('#col_7_35')
			.click('#col_9_35')
			.click('#col_10_26')
			.click('#col_10_27')
			.click('#col_10_36')
			.click('#col_11_27')
			.click('#col_11_28')
			.click('#col_11_36')
			.click('#col_12_28')
			.click('#col_12_29')
			.click('#col_12_30')
			.click('#col_12_34')
			.click('#col_12_35')
			.click('#col_12_36')
			.click('#col_31_25')
			.click('#col_31_29')
			.click('#col_31_31')
			.click('#col_31_33')
			.click('#col_31_35')
			.click('#col_32_23')
			.click('#col_32_24')
			.click('#col_32_25')
			.click('#col_32_30')
			.click('#col_32_32')
			.click('#col_32_34')
			.click('#col_33_22')
			.click('#col_33_23')
			.click('#col_34_21')
			.click('#col_34_22')
			.click('#col_35_21')
			.click('#gold')
			.click('#col_6_17')
			.click('#col_7_16')
			.click('#col_7_17')
			.click('#col_7_18')
			.click('#col_7_36')
			.click('#col_8_15')
			.click('#col_8_16')
			.click('#col_8_17')
			.click('#col_8_18')
			.click('#col_8_35')
			.click('#col_8_36')
			.click('#col_9_14')
			.click('#col_9_15')
			.click('#col_9_16')
			.click('#col_9_17')
			.click('#col_9_36')
			.click('#col_10_13')
			.click('#col_10_14')
			.click('#col_10_15')
			.click('#col_10_16')
			.click('#col_10_17')
			.click('#col_10_18')
			.click('#col_11_13')
			.click('#col_11_14')
			.click('#col_11_15')
			.click('#col_11_16')
			.click('#col_11_17')
			.click('#col_11_18')
			.click('#col_12_14')
			.click('#col_12_17')
			.click('#col_15_30')
			.click('#col_15_31')
			.click('#col_16_29')
			.click('#col_16_30')
			.click('#col_16_31')
			.click('#col_16_32')
			.click('#col_17_28')
			.click('#col_17_29')
			.click('#col_17_30')
			.click('#col_17_31')
			.click('#col_17_32')
			.click('#col_17_33')
			.click('#col_18_29')
			.click('#col_18_30')
			.click('#col_18_31')
			.click('#col_18_32')
			.click('#col_19_30')
			.click('#col_19_31')
			.click('#col_17_18')
			.click('#col_18_18')
			.click('#col_18_19')
			.click('#col_18_17')
			.click('#col_19_17')
			.click('#col_19_18')
			.click('#col_19_16')
			.click('#col_20_16')
			.click('#col_20_17')
			.click('#col_20_15')
			.click('#col_21_15')
			.click('#col_21_16')
			.click('#col_21_14')
			.click('#col_22_14')
			.click('#col_22_15')
			.click('#col_22_13')
			.click('#col_23_13')
			.click('#col_23_14')
			.click('#col_24_13')
			.click('#col_23_12')
			.click('#col_37_23')
			.click('#col_36_23')
			.click('#col_35_23')
			.click('#col_35_24')
			.click('#col_35_25')
			.click('#col_35_26')
			.click('#col_36_27')
			.click('#col_37_27')
			.click('#col_34_27')
			.click('#col_34_28')
			.click('#col_34_29')
			.click('#col_34_30')
			.click('#col_34_31')
			.click('#col_34_32')
			.click('#col_34_33')
			.click('#col_34_34')
			.click('#col_34_35')
			.click('#col_33_36')
			.click('#col_34_36')
			.click('#col_35_36')
			.click('#col_36_36')
			.click('#col_37_36')
			.click('#brimstone')
			.click('#col_30_20')
			.click('#col_30_21')
			.click('#col_30_22')
			.click('#col_30_23')
			.click('#col_30_24')
			.click('#col_31_19')
			.click('#col_31_20')
			.click('#col_31_21')
			.click('#col_31_22')
			.click('#col_31_23')
			.click('#col_31_24')
			.click('#col_32_14')
			.click('#col_32_15')
			.click('#col_32_16')
			.click('#col_32_17')
			.click('#col_32_18')
			.click('#col_32_19')
			.click('#col_32_20')
			.click('#col_32_21')
			.click('#col_32_22')
			.click('#col_33_14')
			.click('#col_33_15')
			.click('#col_33_16')
			.click('#col_33_17')
			.click('#col_33_18')
			.click('#col_33_19')
			.click('#col_33_20')
			.click('#col_33_21')
			.click('#col_34_19')
			.click('#col_34_20')
			.click('#col_35_20')
			.click('#water')
			.click('#col_31_15')
			.click('#col_30_15')
			.click('#col_29_15')
			.click('#col_29_16')
			.click('#col_28_16')
			.click('#col_28_17')
			.click('#col_27_17')
			.click('#col_27_18')
			.click('#col_26_18')
			.click('#col_26_19')
			.click('#col_26_20')
			.click('#col_25_20')
			.click('#col_25_21')
			.click('#col_25_22')
			.click('#col_26_22')
			.click('#col_25_23')
			.click('#col_25_24')
			.click('#col_26_24')
			.click('#col_25_25')
			.click('#col_25_26')
			.click('#col_26_26')
			.click('#col_25_27')
			.click('#col_25_28')
			.click('#col_26_28')
			.click('#col_25_29')
			.click('#col_25_30')
			.click('#col_26_30')
			.click('#col_25_31')
			.click('#col_25_32')
			.click('#col_26_32')
			.click('#col_25_33')
			.click('#col_25_34')
			.click('#col_26_34')
			.click('#col_25_35')
			.click('#col_26_35')
			.click('#col_26_36')
			.click('#col_27_35')
			.click('#col_28_36')
			.click('#col_28_35')
			.click('#col_28_34')
			.click('#col_29_34')
			.click('#col_29_35')
			.click('#col_29_33')
			.click('#col_29_32')
			.click('#col_28_32')
			.click('#col_29_31')
			.click('#col_29_30')
			.click('#col_28_30')
			.click('#col_29_29')
			.click('#col_29_28')
			.click('#col_28_28')
			.click('#col_29_27')
			.click('#col_29_26')
			.click('#col_28_26')
			.click('#col_29_25')
			.click('#col_29_24')
			.click('#col_28_24')
			.click('#col_29_23')
			.click('#col_29_22')
			.click('#col_28_22')
			.click('#col_29_21')
			.click('#col_29_20')
			.click('#col_28_20')
			.click('#col_29_19')
			.click('#col_30_19')
			.click('#col_30_18')
			.click('#col_31_18')
			.click('#col_31_17')
			.click('#col_31_16')
			.click('#permafrost')
			.click('#col_30_16')
			.click('#col_30_17')
			.click('#col_29_17')
			.click('#col_29_18')
			.click('#col_28_18')
			.click('#col_28_19')
			.click('#col_27_19')
			.click('#col_27_20')
			.click('#col_27_21')
			.click('#col_26_21')
			.click('#col_28_21')
			.click('#col_27_22')
			.click('#col_27_23')
			.click('#col_26_23')
			.click('#col_28_23')
			.click('#col_27_24')
			.click('#col_27_25')
			.click('#col_26_25')
			.click('#col_28_25')
			.click('#col_27_26')
			.click('#col_27_27')
			.click('#col_26_27')
			.click('#col_28_27')
			.click('#col_27_28')
			.click('#col_27_29')
			.click('#col_26_29')
			.click('#col_28_29')
			.click('#col_27_30')
			.click('#col_27_31')
			.click('#col_26_31')
			.click('#col_28_31')
			.click('#col_27_32')
			.click('#col_27_33')
			.click('#col_26_33')
			.click('#col_28_33')
			.click('#col_27_34')
			.click('#archiveshrine')
			.click('#col_25_7')
			.click('#gateway')
			.click('#col_37_25')
			.click('#col_8_25')
			.click('#core_p1')
			.click('#col_8_32')
			.click('#dirt')
			.click('#col_8_27')
			.click('#col_8_28')
			.click('#col_8_29')
			.click('#col_31_27')
			.click('#col_32_27')
			.click('#col_33_27');

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};