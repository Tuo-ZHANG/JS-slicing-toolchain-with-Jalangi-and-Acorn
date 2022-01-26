J$.iids = {"9":[4,7,4,8],"10":[6,7,6,12],"17":[4,7,4,8],"18":[7,8,7,9],"25":[4,3,4,9],"33":[5,7,5,8],"41":[5,7,5,8],"49":[5,3,5,9],"57":[6,7,6,8],"65":[6,11,6,12],"73":[6,7,6,12],"81":[6,3,6,13],"89":[7,8,7,9],"97":[7,3,7,4],"105":[7,3,7,9],"113":[7,3,7,10],"121":[8,10,8,11],"129":[8,10,8,11],"137":[8,3,8,12],"145":[1,1,9,2],"153":[1,1,9,2],"161":[1,1,9,2],"169":[1,1,9,2],"177":[10,1,10,8],"185":[10,1,10,10],"193":[10,1,10,11],"201":[1,1,11,1],"209":[1,1,9,2],"217":[1,1,11,1],"225":[1,1,9,2],"233":[1,1,9,2],"241":[1,1,11,1],"249":[1,1,11,1],"nBranches":0,"originalCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone 2.js","instrumentedCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone 2_jalangi_.js","code":"function sliceMe() {\r\n  var x;\r\n  var y;\r\n  x = 1;\r\n  y = 2;\r\n  x = x + y;\r\n  y += 2;\r\n  return y; // slicing criterion\r\n}\r\nsliceMe();\r\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(201, 'E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone 2_jalangi_.js', 'E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone 2.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(145, arguments.callee, this, arguments);
                            arguments = J$.N(153, 'arguments', arguments, 4);
                            J$.N(161, 'x', x, 0);
                            J$.N(169, 'y', y, 0);
                            var x;
                            var y;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.T(33, 2, 22, false), y, 0));
                            J$.X1(81, x = J$.W(73, 'x', J$.B(10, '+', J$.R(57, 'x', x, 0), J$.R(65, 'y', y, 0), 0), x, 0));
                            J$.X1(113, y = J$.W(105, 'y', J$.B(18, '+', J$.R(97, 'y', y, 0), J$.T(89, 2, 22, false), 0), y, 0));
                            return J$.X1(137, J$.Rt(129, J$.R(121, 'y', y, 0)));
                        } catch (J$e) {
                            J$.Ex(225, J$e);
                        } finally {
                            if (J$.Fr(233))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(217, 'sliceMe', J$.T(209, sliceMe, 12, false, 145), 0);
            J$.X1(193, J$.F(185, J$.R(177, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(241, J$e);
        } finally {
            if (J$.Sr(249)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
