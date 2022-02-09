J$.iids = {"8":[8,7,8,12],"9":[5,7,5,8],"10":[8,7,8,12],"16":[10,7,10,12],"17":[5,7,5,8],"18":[9,10,9,11],"25":[5,3,5,9],"26":[10,7,10,12],"33":[6,7,6,8],"34":[11,10,11,11],"41":[6,7,6,8],"49":[6,3,6,9],"57":[7,7,7,8],"65":[7,7,7,8],"73":[7,3,7,9],"81":[8,7,8,8],"89":[8,11,8,12],"97":[9,10,9,11],"105":[9,5,9,6],"113":[9,5,9,11],"121":[9,5,9,12],"129":[10,7,10,8],"137":[10,11,10,12],"145":[11,10,11,11],"153":[11,5,11,6],"161":[11,5,11,11],"169":[11,5,11,12],"177":[12,10,12,11],"185":[12,10,12,11],"193":[12,3,12,12],"201":[1,1,13,2],"209":[1,1,13,2],"217":[1,1,13,2],"225":[1,1,13,2],"233":[1,1,13,2],"241":[14,1,14,8],"249":[14,1,14,10],"257":[14,1,14,11],"265":[1,1,15,1],"273":[1,1,13,2],"281":[1,1,15,1],"289":[8,3,9,12],"297":[10,3,11,12],"305":[1,1,13,2],"313":[1,1,13,2],"321":[1,1,15,1],"329":[1,1,15,1],"nBranches":4,"originalCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone3.js","instrumentedCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone3_jalangi_.js","code":"function sliceMe() {\r\n  var x;\r\n  var y;\r\n  var z;\r\n  x = 1;\r\n  y = 2;\r\n  z = 3;\r\n  if (x < 4) \r\n    y += 2;\r\n  if (x > 0) \r\n    z -= 5;\r\n  return y; // slicing criterion\r\n}\r\nsliceMe();\r\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(265, 'E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone3_jalangi_.js', 'E:\\study\\program analysis\\jalangi2-master\\experiments\\milestone3.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(201, arguments.callee, this, arguments);
                            arguments = J$.N(209, 'arguments', arguments, 4);
                            J$.N(217, 'x', x, 0);
                            J$.N(225, 'y', y, 0);
                            J$.N(233, 'z', z, 0);
                            var x;
                            var y;
                            var z;
                            J$.X1(25, x = J$.W(17, 'x', J$.T(9, 1, 22, false), x, 0));
                            J$.X1(49, y = J$.W(41, 'y', J$.T(33, 2, 22, false), y, 0));
                            J$.X1(73, z = J$.W(65, 'z', J$.T(57, 3, 22, false), z, 0));
                            if (J$.X1(289, J$.C(8, J$.B(10, '<', J$.R(81, 'x', x, 0), J$.T(89, 4, 22, false), 0))))
                                J$.X1(121, y = J$.W(113, 'y', J$.B(18, '+', J$.R(105, 'y', y, 0), J$.T(97, 2, 22, false), 0), y, 0));
                            if (J$.X1(297, J$.C(16, J$.B(26, '>', J$.R(129, 'x', x, 0), J$.T(137, 0, 22, false), 0))))
                                J$.X1(169, z = J$.W(161, 'z', J$.B(34, '-', J$.R(153, 'z', z, 0), J$.T(145, 5, 22, false), 0), z, 0));
                            return J$.X1(193, J$.Rt(185, J$.R(177, 'y', y, 0)));
                        } catch (J$e) {
                            J$.Ex(305, J$e);
                        } finally {
                            if (J$.Fr(313))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(281, 'sliceMe', J$.T(273, sliceMe, 12, false, 201), 0);
            J$.X1(257, J$.F(249, J$.R(241, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(321, J$e);
        } finally {
            if (J$.Sr(329)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
