J$.iids = {"8":[6,20,6,26],"9":[2,13,2,15],"10":[4,9,4,14],"16":[5,13,5,20],"17":[2,13,2,15],"18":[5,13,5,20],"24":[4,9,4,14],"25":[2,13,2,15],"26":[6,20,6,26],"33":[3,13,3,14],"41":[3,13,3,14],"49":[3,13,3,14],"57":[4,9,4,10],"65":[4,13,4,14],"73":[5,13,5,14],"81":[5,17,5,20],"89":[6,20,6,21],"97":[6,24,6,26],"105":[7,17,7,18],"113":[7,17,7,18],"121":[7,13,7,19],"129":[10,12,10,13],"137":[10,12,10,13],"145":[10,5,10,14],"153":[1,1,11,2],"161":[1,1,11,2],"169":[1,1,11,2],"177":[1,1,11,2],"185":[12,1,12,8],"193":[12,1,12,10],"201":[12,1,12,11],"209":[1,1,12,11],"217":[1,1,11,2],"225":[1,1,12,11],"233":[6,16,8,10],"241":[5,9,8,10],"249":[4,5,9,6],"257":[1,1,11,2],"265":[1,1,11,2],"273":[1,1,12,11],"281":[1,1,12,11],"nBranches":6,"originalCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\project_v3\\scripts\\predicted.js","instrumentedCodeFileName":"E:\\study\\program analysis\\jalangi2-master\\experiments\\project_v3\\scripts\\predicted_jalangi_.js","code":"function sliceMe() {\n    var x = 10;\n    var y = 0;\n    if (x > 0) {\n        if (x > 100) {\n        } else if (x < 50) {\n            y = 1;\n        }\n    }\n    return y;\n}\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(209, 'E:\\study\\program analysis\\jalangi2-master\\experiments\\project_v3\\scripts\\predicted_jalangi_.js', 'E:\\study\\program analysis\\jalangi2-master\\experiments\\project_v3\\scripts\\predicted.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(153, arguments.callee, this, arguments);
                            arguments = J$.N(161, 'arguments', arguments, 4);
                            J$.N(169, 'x', x, 0);
                            J$.N(177, 'y', y, 0);
                            var x = J$.X1(25, J$.W(17, 'x', J$.T(9, 10, 22, false), x, 1));
                            var y = J$.X1(49, J$.W(41, 'y', J$.T(33, 0, 22, false), y, 1));
                            if (J$.X1(249, J$.C(24, J$.B(10, '>', J$.R(57, 'x', x, 0), J$.T(65, 0, 22, false), 0)))) {
                                if (J$.X1(241, J$.C(16, J$.B(18, '>', J$.R(73, 'x', x, 0), J$.T(81, 100, 22, false), 0)))) {
                                } else if (J$.X1(233, J$.C(8, J$.B(26, '<', J$.R(89, 'x', x, 0), J$.T(97, 50, 22, false), 0)))) {
                                    J$.X1(121, y = J$.W(113, 'y', J$.T(105, 1, 22, false), y, 0));
                                }
                            }
                            return J$.X1(145, J$.Rt(137, J$.R(129, 'y', y, 0)));
                        } catch (J$e) {
                            J$.Ex(257, J$e);
                        } finally {
                            if (J$.Fr(265))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(225, 'sliceMe', J$.T(217, sliceMe, 12, false, 153), 0);
            J$.X1(201, J$.F(193, J$.R(185, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(273, J$e);
        } finally {
            if (J$.Sr(281)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
