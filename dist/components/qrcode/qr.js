'use strict';

var QR = function () {

    // alignment pattern
    var adelta = [0, 11, 15, 19, 23, 27, 31, // force 1 pat
    16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24, 26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28];

    // version block
    var vpat = [0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69];

    // final format bits with mask: level << 3 | mask
    var fmtword = [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976, //L
    0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0, //M
    0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed, //Q
    0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b //H
    ];

    // 4 per version: number of blocks 1,2; data width; ecc width
    var eccblocks = [1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17, 1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28, 1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22, 1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16, 1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22, 2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28, 2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26, 2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26, 2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24, 2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28, 4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24, 2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28, 4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22, 3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24, 5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24, 5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30, 1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28, 5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28, 3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26, 3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28, 4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30, 2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24, 4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30, 6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30, 8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30, 10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30, 8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30, 3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30, 7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30, 5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30, 13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30, 17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30, 17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30, 13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30, 12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30, 6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30, 17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30, 4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30, 20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30, 19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30];

    // Galois field log table
    var glog = [0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b, 0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71, 0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45, 0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6, 0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88, 0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40, 0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d, 0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57, 0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18, 0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e, 0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61, 0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2, 0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6, 0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a, 0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7, 0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf];

    // Galios field exponent table
    var gexp = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26, 0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0, 0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23, 0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1, 0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0, 0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2, 0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce, 0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc, 0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54, 0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73, 0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff, 0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41, 0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6, 0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09, 0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16, 0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00];

    // Working buffers:
    // data input and ecc append, image working buffer, fixed part of image, run lengths for badness
    var strinbuf = [],
        eccbuf = [],
        qrframe = [],
        framask = [],
        rlens = [];
    // Control values - width is based on version, last 4 are from table.
    var version, width, neccblk1, neccblk2, datablkw, eccblkwid;
    var ecclevel = 2;
    // set bit to indicate cell in qrframe is immutable.  symmetric around diagonal
    function setmask(x, y) {
        var bt;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        // y*y = 1+3+5...
        bt = y;
        bt *= y;
        bt += y;
        bt >>= 1;
        bt += x;
        framask[bt] = 1;
    }

    // enter alignment pattern - black to qrframe, white to mask (later black frame merged to mask)
    function putalign(x, y) {
        var j;

        qrframe[x + width * y] = 1;
        for (j = -2; j < 2; j++) {
            qrframe[x + j + width * (y - 2)] = 1;
            qrframe[x - 2 + width * (y + j + 1)] = 1;
            qrframe[x + 2 + width * (y + j)] = 1;
            qrframe[x + j + 1 + width * (y + 2)] = 1;
        }
        for (j = 0; j < 2; j++) {
            setmask(x - 1, y + j);
            setmask(x + 1, y - j);
            setmask(x - j, y - 1);
            setmask(x + j, y + 1);
        }
    }

    //========================================================================
    // Reed Solomon error correction
    // exponentiation mod N
    function modnn(x) {
        while (x >= 255) {
            x -= 255;
            x = (x >> 8) + (x & 255);
        }
        return x;
    }

    var genpoly = [];

    // Calculate and append ECC data to data block.  Block is in strinbuf, indexes to buffers given.
    function appendrs(data, dlen, ecbuf, eclen) {
        var i, j, fb;

        for (i = 0; i < eclen; i++) {
            strinbuf[ecbuf + i] = 0;
        }for (i = 0; i < dlen; i++) {
            fb = glog[strinbuf[data + i] ^ strinbuf[ecbuf]];
            if (fb != 255) /* fb term is non-zero */
                for (j = 1; j < eclen; j++) {
                    strinbuf[ecbuf + j - 1] = strinbuf[ecbuf + j] ^ gexp[modnn(fb + genpoly[eclen - j])];
                } else for (j = ecbuf; j < ecbuf + eclen; j++) {
                strinbuf[j] = strinbuf[j + 1];
            }strinbuf[ecbuf + eclen - 1] = fb == 255 ? 0 : gexp[modnn(fb + genpoly[0])];
        }
    }

    //========================================================================
    // Frame data insert following the path rules

    // check mask - since symmetrical use half.
    function ismasked(x, y) {
        var bt;
        if (x > y) {
            bt = x;
            x = y;
            y = bt;
        }
        bt = y;
        bt += y * y;
        bt >>= 1;
        bt += x;
        return framask[bt];
    }

    //========================================================================
    //  Apply the selected mask out of the 8.
    function applymask(m) {
        var x, y, r3x, r3y;

        switch (m) {
            case 0:
                for (y = 0; y < width; y++) {
                    for (x = 0; x < width; x++) {
                        if (!(x + y & 1) && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }break;
            case 1:
                for (y = 0; y < width; y++) {
                    for (x = 0; x < width; x++) {
                        if (!(y & 1) && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }break;
            case 2:
                for (y = 0; y < width; y++) {
                    for (r3x = 0, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) r3x = 0;
                        if (!r3x && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }break;
            case 3:
                for (r3y = 0, y = 0; y < width; y++, r3y++) {
                    if (r3y == 3) r3y = 0;
                    for (r3x = r3y, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) r3x = 0;
                        if (!r3x && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }
                break;
            case 4:
                for (y = 0; y < width; y++) {
                    for (r3x = 0, r3y = y >> 1 & 1, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) {
                            r3x = 0;
                            r3y = !r3y;
                        }
                        if (!r3y && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }break;
            case 5:
                for (r3y = 0, y = 0; y < width; y++, r3y++) {
                    if (r3y == 3) r3y = 0;
                    for (r3x = 0, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) r3x = 0;
                        if (!((x & y & 1) + !(!r3x | !r3y)) && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }
                break;
            case 6:
                for (r3y = 0, y = 0; y < width; y++, r3y++) {
                    if (r3y == 3) r3y = 0;
                    for (r3x = 0, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) r3x = 0;
                        if (!((x & y & 1) + (r3x && r3x == r3y) & 1) && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }
                break;
            case 7:
                for (r3y = 0, y = 0; y < width; y++, r3y++) {
                    if (r3y == 3) r3y = 0;
                    for (r3x = 0, x = 0; x < width; x++, r3x++) {
                        if (r3x == 3) r3x = 0;
                        if (!((r3x && r3x == r3y) + (x + y & 1) & 1) && !ismasked(x, y)) qrframe[x + y * width] ^= 1;
                    }
                }
                break;
        }
        return;
    }

    // Badness coefficients.
    var N1 = 3,
        N2 = 3,
        N3 = 40,
        N4 = 10;

    // Using the table of the length of each run, calculate the amount of bad image 
    // - long runs or those that look like finders; called twice, once each for X and Y
    function badruns(length) {
        var i;
        var runsbad = 0;
        for (i = 0; i <= length; i++) {
            if (rlens[i] >= 5) runsbad += N1 + rlens[i] - 5;
        } // BwBBBwB as in finder
        for (i = 3; i < length - 1; i += 2) {
            if (rlens[i - 2] == rlens[i + 2] && rlens[i + 2] == rlens[i - 1] && rlens[i - 1] == rlens[i + 1] && rlens[i - 1] * 3 == rlens[i]
            // white around the black pattern? Not part of spec
            && (rlens[i - 3] == 0 // beginning
            || i + 3 > length // end
            || rlens[i - 3] * 3 >= rlens[i] * 4 || rlens[i + 3] * 3 >= rlens[i] * 4)) runsbad += N3;
        }return runsbad;
    }

    // Calculate how bad the masked image is - blocks, imbalance, runs, or finders.
    function badcheck() {
        var x, y, h, b, b1;
        var thisbad = 0;
        var bw = 0;

        // blocks of same color.
        for (y = 0; y < width - 1; y++) {
            for (x = 0; x < width - 1; x++) {
                if (qrframe[x + width * y] && qrframe[x + 1 + width * y] && qrframe[x + width * (y + 1)] && qrframe[x + 1 + width * (y + 1)] || // all black
                !(qrframe[x + width * y] || qrframe[x + 1 + width * y] || qrframe[x + width * (y + 1)] || qrframe[x + 1 + width * (y + 1)])) // all white
                    thisbad += N2;
            }
        } // X runs
        for (y = 0; y < width; y++) {
            rlens[0] = 0;
            for (h = b = x = 0; x < width; x++) {
                if ((b1 = qrframe[x + width * y]) == b) rlens[h]++;else rlens[++h] = 1;
                b = b1;
                bw += b ? 1 : -1;
            }
            thisbad += badruns(h);
        }

        // black/white imbalance
        if (bw < 0) bw = -bw;

        var big = bw;
        var count = 0;
        big += big << 2;
        big <<= 1;
        while (big > width * width) {
            big -= width * width, count++;
        }thisbad += count * N4;

        // Y runs
        for (x = 0; x < width; x++) {
            rlens[0] = 0;
            for (h = b = y = 0; y < width; y++) {
                if ((b1 = qrframe[x + width * y]) == b) rlens[h]++;else rlens[++h] = 1;
                b = b1;
            }
            thisbad += badruns(h);
        }
        return thisbad;
    }

    function genframe(instring) {
        var x, y, k, t, v, i, j, m;

        // find the smallest version that fits the string
        t = instring.length;
        version = 0;
        do {
            version++;
            k = (ecclevel - 1) * 4 + (version - 1) * 16;
            neccblk1 = eccblocks[k++];
            neccblk2 = eccblocks[k++];
            datablkw = eccblocks[k++];
            eccblkwid = eccblocks[k];
            k = datablkw * (neccblk1 + neccblk2) + neccblk2 - 3 + (version <= 9);
            if (t <= k) break;
        } while (version < 40);

        // FIXME - insure that it fits insted of being truncated
        width = 17 + 4 * version;

        // allocate, clear and setup data structures
        v = datablkw + (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
        for (t = 0; t < v; t++) {
            eccbuf[t] = 0;
        }strinbuf = instring.slice(0);

        for (t = 0; t < width * width; t++) {
            qrframe[t] = 0;
        }for (t = 0; t < (width * (width + 1) + 1) / 2; t++) {
            framask[t] = 0;
        } // insert finders - black to frame, white to mask
        for (t = 0; t < 3; t++) {
            k = 0;
            y = 0;
            if (t == 1) k = width - 7;
            if (t == 2) y = width - 7;
            qrframe[y + 3 + width * (k + 3)] = 1;
            for (x = 0; x < 6; x++) {
                qrframe[y + x + width * k] = 1;
                qrframe[y + width * (k + x + 1)] = 1;
                qrframe[y + 6 + width * (k + x)] = 1;
                qrframe[y + x + 1 + width * (k + 6)] = 1;
            }
            for (x = 1; x < 5; x++) {
                setmask(y + x, k + 1);
                setmask(y + 1, k + x + 1);
                setmask(y + 5, k + x);
                setmask(y + x + 1, k + 5);
            }
            for (x = 2; x < 4; x++) {
                qrframe[y + x + width * (k + 2)] = 1;
                qrframe[y + 2 + width * (k + x + 1)] = 1;
                qrframe[y + 4 + width * (k + x)] = 1;
                qrframe[y + x + 1 + width * (k + 4)] = 1;
            }
        }

        // alignment blocks
        if (version > 1) {
            t = adelta[version];
            y = width - 7;
            for (;;) {
                x = width - 7;
                while (x > t - 3) {
                    putalign(x, y);
                    if (x < t) break;
                    x -= t;
                }
                if (y <= t + 9) break;
                y -= t;
                putalign(6, y);
                putalign(y, 6);
            }
        }

        // single black
        qrframe[8 + width * (width - 8)] = 1;

        // timing gap - mask only
        for (y = 0; y < 7; y++) {
            setmask(7, y);
            setmask(width - 8, y);
            setmask(7, y + width - 7);
        }
        for (x = 0; x < 8; x++) {
            setmask(x, 7);
            setmask(x + width - 8, 7);
            setmask(x, width - 8);
        }

        // reserve mask-format area
        for (x = 0; x < 9; x++) {
            setmask(x, 8);
        }for (x = 0; x < 8; x++) {
            setmask(x + width - 8, 8);
            setmask(8, x);
        }
        for (y = 0; y < 7; y++) {
            setmask(8, y + width - 7);
        } // timing row/col
        for (x = 0; x < width - 14; x++) {
            if (x & 1) {
                setmask(8 + x, 6);
                setmask(6, 8 + x);
            } else {
                qrframe[8 + x + width * 6] = 1;
                qrframe[6 + width * (8 + x)] = 1;
            }
        } // version block
        if (version > 6) {
            t = vpat[version - 7];
            k = 17;
            for (x = 0; x < 6; x++) {
                for (y = 0; y < 3; y++, k--) {
                    if (1 & (k > 11 ? version >> k - 12 : t >> k)) {
                        qrframe[5 - x + width * (2 - y + width - 11)] = 1;
                        qrframe[2 - y + width - 11 + width * (5 - x)] = 1;
                    } else {
                        setmask(5 - x, 2 - y + width - 11);
                        setmask(2 - y + width - 11, 5 - x);
                    }
                }
            }
        }

        // sync mask bits - only set above for white spaces, so add in black bits
        for (y = 0; y < width; y++) {
            for (x = 0; x <= y; x++) {
                if (qrframe[x + width * y]) setmask(x, y);
            }
        } // convert string to bitstream
        // 8 bit data to QR-coded 8 bit data (numeric or alphanum, or kanji not supported)
        v = strinbuf.length;

        // string to array
        for (i = 0; i < v; i++) {
            eccbuf[i] = strinbuf.charCodeAt(i);
        }strinbuf = eccbuf.slice(0);

        // calculate max string length
        x = datablkw * (neccblk1 + neccblk2) + neccblk2;
        if (v >= x - 2) {
            v = x - 2;
            if (version > 9) v--;
        }

        // shift and repack to insert length prefix
        i = v;
        if (version > 9) {
            strinbuf[i + 2] = 0;
            strinbuf[i + 3] = 0;
            while (i--) {
                t = strinbuf[i];
                strinbuf[i + 3] |= 255 & t << 4;
                strinbuf[i + 2] = t >> 4;
            }
            strinbuf[2] |= 255 & v << 4;
            strinbuf[1] = v >> 4;
            strinbuf[0] = 0x40 | v >> 12;
        } else {
            strinbuf[i + 1] = 0;
            strinbuf[i + 2] = 0;
            while (i--) {
                t = strinbuf[i];
                strinbuf[i + 2] |= 255 & t << 4;
                strinbuf[i + 1] = t >> 4;
            }
            strinbuf[1] |= 255 & v << 4;
            strinbuf[0] = 0x40 | v >> 4;
        }
        // fill to end with pad pattern
        i = v + 3 - (version < 10);
        while (i < x) {
            strinbuf[i++] = 0xec;
            // buffer has room    if (i == x)      break;
            strinbuf[i++] = 0x11;
        }

        // calculate and append ECC

        // calculate generator polynomial
        genpoly[0] = 1;
        for (i = 0; i < eccblkwid; i++) {
            genpoly[i + 1] = 1;
            for (j = i; j > 0; j--) {
                genpoly[j] = genpoly[j] ? genpoly[j - 1] ^ gexp[modnn(glog[genpoly[j]] + i)] : genpoly[j - 1];
            }genpoly[0] = gexp[modnn(glog[genpoly[0]] + i)];
        }
        for (i = 0; i <= eccblkwid; i++) {
            genpoly[i] = glog[genpoly[i]];
        } // use logs for genpoly[] to save calc step

        // append ecc to data buffer
        k = x;
        y = 0;
        for (i = 0; i < neccblk1; i++) {
            appendrs(y, datablkw, k, eccblkwid);
            y += datablkw;
            k += eccblkwid;
        }
        for (i = 0; i < neccblk2; i++) {
            appendrs(y, datablkw + 1, k, eccblkwid);
            y += datablkw + 1;
            k += eccblkwid;
        }
        // interleave blocks
        y = 0;
        for (i = 0; i < datablkw; i++) {
            for (j = 0; j < neccblk1; j++) {
                eccbuf[y++] = strinbuf[i + j * datablkw];
            }for (j = 0; j < neccblk2; j++) {
                eccbuf[y++] = strinbuf[neccblk1 * datablkw + i + j * (datablkw + 1)];
            }
        }
        for (j = 0; j < neccblk2; j++) {
            eccbuf[y++] = strinbuf[neccblk1 * datablkw + i + j * (datablkw + 1)];
        }for (i = 0; i < eccblkwid; i++) {
            for (j = 0; j < neccblk1 + neccblk2; j++) {
                eccbuf[y++] = strinbuf[x + i + j * eccblkwid];
            }
        }strinbuf = eccbuf;

        // pack bits into frame avoiding masked area.
        x = y = width - 1;
        k = v = 1; // up, minus
        /* inteleaved data and ecc codes */
        m = (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
        for (i = 0; i < m; i++) {
            t = strinbuf[i];
            for (j = 0; j < 8; j++, t <<= 1) {
                if (0x80 & t) qrframe[x + width * y] = 1;
                do {
                    // find next fill position
                    if (v) x--;else {
                        x++;
                        if (k) {
                            if (y != 0) y--;else {
                                x -= 2;
                                k = !k;
                                if (x == 6) {
                                    x--;
                                    y = 9;
                                }
                            }
                        } else {
                            if (y != width - 1) y++;else {
                                x -= 2;
                                k = !k;
                                if (x == 6) {
                                    x--;
                                    y -= 8;
                                }
                            }
                        }
                    }
                    v = !v;
                } while (ismasked(x, y));
            }
        }

        // save pre-mask copy of frame
        strinbuf = qrframe.slice(0);
        t = 0; // best
        y = 30000; // demerit
        // for instead of while since in original arduino code
        // if an early mask was "good enough" it wouldn't try for a better one
        // since they get more complex and take longer.
        for (k = 0; k < 8; k++) {
            applymask(k); // returns black-white imbalance
            x = badcheck();
            if (x < y) {
                // current mask better than previous best?
                y = x;
                t = k;
            }
            if (t == 7) break; // don't increment i to a void redoing mask
            qrframe = strinbuf.slice(0); // reset for next pass
        }
        if (t != k) // redo best mask - none good enough, last wasn't t
            applymask(t);

        // add in final mask/ecclevel bytes
        y = fmtword[t + (ecclevel - 1 << 3)];
        // low byte
        for (k = 0; k < 8; k++, y >>= 1) {
            if (y & 1) {
                qrframe[width - 1 - k + width * 8] = 1;
                if (k < 6) qrframe[8 + width * k] = 1;else qrframe[8 + width * (k + 1)] = 1;
            }
        } // high byte
        for (k = 0; k < 7; k++, y >>= 1) {
            if (y & 1) {
                qrframe[8 + width * (width - 7 + k)] = 1;
                if (k) qrframe[6 - k + width * 8] = 1;else qrframe[7 + width * 8] = 1;
            }
        } // return image
        return qrframe;
    }

    var _canvas = null,
        _size = null;

    var api = {

        get ecclevel() {
            return ecclevel;
        },

        set ecclevel(val) {
            ecclevel = val;
        },

        get size() {
            return _size;
        },

        set size(val) {
            _size = val;
        },

        get canvas() {
            return _canvas;
        },

        set canvas(el) {
            _canvas = el;
        },

        getFrame: function getFrame(string) {
            return genframe(string);
        },

        draw: function draw(string, canvas, size, ecc) {

            ecclevel = ecc || ecclevel;
            canvas = canvas || _canvas;

            if (!canvas) {
                console.warn('No canvas provided to draw QR code in!');
                return;
            }

            size = size || _size || Math.min(canvas.width, canvas.height);

            var frame = genframe(string),
                ctx = canvas.ctx,
                px = Math.round(size / (width + 8));

            var roundedSize = px * (width + 8),
                offset = Math.floor((size - roundedSize) / 2);

            size = roundedSize;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setFillStyle('#000000');

            for (var i = 0; i < width; i++) {
                for (var j = 0; j < width; j++) {
                    if (frame[j * width + i]) {
                        ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
                    }
                }
            }
            ctx.draw();
        }
    };

    module.exports = {
        api: api
    };
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInFyLmpzIl0sIm5hbWVzIjpbIlFSIiwiYWRlbHRhIiwidnBhdCIsImZtdHdvcmQiLCJlY2NibG9ja3MiLCJnbG9nIiwiZ2V4cCIsInN0cmluYnVmIiwiZWNjYnVmIiwicXJmcmFtZSIsImZyYW1hc2siLCJybGVucyIsInZlcnNpb24iLCJ3aWR0aCIsIm5lY2NibGsxIiwibmVjY2JsazIiLCJkYXRhYmxrdyIsImVjY2Jsa3dpZCIsImVjY2xldmVsIiwic2V0bWFzayIsIngiLCJ5IiwiYnQiLCJwdXRhbGlnbiIsImoiLCJtb2RubiIsImdlbnBvbHkiLCJhcHBlbmRycyIsImRhdGEiLCJkbGVuIiwiZWNidWYiLCJlY2xlbiIsImkiLCJmYiIsImlzbWFza2VkIiwiYXBwbHltYXNrIiwibSIsInIzeCIsInIzeSIsIk4xIiwiTjIiLCJOMyIsIk40IiwiYmFkcnVucyIsImxlbmd0aCIsInJ1bnNiYWQiLCJiYWRjaGVjayIsImgiLCJiIiwiYjEiLCJ0aGlzYmFkIiwiYnciLCJiaWciLCJjb3VudCIsImdlbmZyYW1lIiwiaW5zdHJpbmciLCJrIiwidCIsInYiLCJzbGljZSIsImNoYXJDb2RlQXQiLCJfY2FudmFzIiwiX3NpemUiLCJhcGkiLCJ2YWwiLCJzaXplIiwiY2FudmFzIiwiZWwiLCJnZXRGcmFtZSIsInN0cmluZyIsImRyYXciLCJlY2MiLCJjb25zb2xlIiwid2FybiIsIk1hdGgiLCJtaW4iLCJoZWlnaHQiLCJmcmFtZSIsImN0eCIsInB4Iiwicm91bmQiLCJyb3VuZGVkU2l6ZSIsIm9mZnNldCIsImZsb29yIiwiY2xlYXJSZWN0Iiwic2V0RmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLEtBQU0sWUFBWTs7QUFFbEI7QUFDQSxRQUFJQyxTQUFTLENBQ1gsQ0FEVyxFQUNSLEVBRFEsRUFDSixFQURJLEVBQ0EsRUFEQSxFQUNJLEVBREosRUFDUSxFQURSLEVBQ1ksRUFEWixFQUNnQjtBQUMz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OztBQUlBLGdCQUFJb0UsY0FBY0YsTUFBTWxFLFFBQVEsQ0FBZCxDQUFsQjtBQUFBLGdCQUNJcUUsU0FBU1IsS0FBS1MsS0FBTCxDQUFXLENBQUNsQixPQUFPZ0IsV0FBUixJQUF1QixDQUFsQyxDQURiOztBQUdBaEIsbUJBQU9nQixXQUFQOztBQUVBSCxnQkFBSU0sU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0JsQixPQUFPckQsS0FBM0IsRUFBa0NxRCxPQUFPVSxNQUF6QztBQUNBRSxnQkFBSU8sWUFBSixDQUFpQixTQUFqQjs7QUFFQSxpQkFBSyxJQUFJckQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbkIsS0FBcEIsRUFBMkJtQixHQUEzQixFQUFnQztBQUM1QixxQkFBSyxJQUFJUixJQUFJLENBQWIsRUFBZ0JBLElBQUlYLEtBQXBCLEVBQTJCVyxHQUEzQixFQUFnQztBQUM1Qix3QkFBSXFELE1BQU1yRCxJQUFJWCxLQUFKLEdBQVltQixDQUFsQixDQUFKLEVBQTBCO0FBQ3RCOEMsNEJBQUlRLFFBQUosQ0FBYVAsTUFBTSxJQUFJL0MsQ0FBVixJQUFla0QsTUFBNUIsRUFBb0NILE1BQU0sSUFBSXZELENBQVYsSUFBZTBELE1BQW5ELEVBQTJESCxFQUEzRCxFQUErREEsRUFBL0Q7QUFDSDtBQUNKO0FBQ0o7QUFDREQsZ0JBQUlSLElBQUo7QUFDSDtBQTlESyxLQUFWOztBQWlFQWlCLFdBQU9DLE9BQVAsR0FBaUI7QUFDYnpCLGFBQUtBO0FBRFEsS0FBakI7QUFJSCxDQXp3QlEsRUFBVCIsImZpbGUiOiJxci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBRUiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLy8gYWxpZ25tZW50IHBhdHRlcm5cclxuICAgIHZhciBhZGVsdGEgPSBbXHJcbiAgICAgIDAsIDExLCAxNSwgMTksIDIzLCAyNywgMzEsIC8vIGZvcmNlIDEgcGF0XHJcbiAgICAgIDE2LCAxOCwgMjAsIDIyLCAyNCwgMjYsIDI4LCAyMCwgMjIsIDI0LCAyNCwgMjYsIDI4LCAyOCwgMjIsIDI0LCAyNCxcclxuICAgICAgMjYsIDI2LCAyOCwgMjgsIDI0LCAyNCwgMjYsIDI2LCAyNiwgMjgsIDI4LCAyNCwgMjYsIDI2LCAyNiwgMjgsIDI4XHJcbiAgICAgIF07XHJcblxyXG4gICAgLy8gdmVyc2lvbiBibG9ja1xyXG4gICAgdmFyIHZwYXQgPSBbXHJcbiAgICAgICAgMHhjOTQsIDB4NWJjLCAweGE5OSwgMHg0ZDMsIDB4YmY2LCAweDc2MiwgMHg4NDcsIDB4NjBkLFxyXG4gICAgICAgIDB4OTI4LCAweGI3OCwgMHg0NWQsIDB4YTE3LCAweDUzMiwgMHg5YTYsIDB4NjgzLCAweDhjOSxcclxuICAgICAgICAweDdlYywgMHhlYzQsIDB4MWUxLCAweGZhYiwgMHgwOGUsIDB4YzFhLCAweDMzZiwgMHhkNzUsXHJcbiAgICAgICAgMHgyNTAsIDB4OWQ1LCAweDZmMCwgMHg4YmEsIDB4NzlmLCAweGIwYiwgMHg0MmUsIDB4YTY0LFxyXG4gICAgICAgIDB4NTQxLCAweGM2OVxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBmaW5hbCBmb3JtYXQgYml0cyB3aXRoIG1hc2s6IGxldmVsIDw8IDMgfCBtYXNrXHJcbiAgICB2YXIgZm10d29yZCA9IFtcclxuICAgICAgICAweDc3YzQsIDB4NzJmMywgMHg3ZGFhLCAweDc4OWQsIDB4NjYyZiwgMHg2MzE4LCAweDZjNDEsIDB4Njk3NiwgICAgLy9MXHJcbiAgICAgICAgMHg1NDEyLCAweDUxMjUsIDB4NWU3YywgMHg1YjRiLCAweDQ1ZjksIDB4NDBjZSwgMHg0Zjk3LCAweDRhYTAsICAgIC8vTVxyXG4gICAgICAgIDB4MzU1ZiwgMHgzMDY4LCAweDNmMzEsIDB4M2EwNiwgMHgyNGI0LCAweDIxODMsIDB4MmVkYSwgMHgyYmVkLCAgICAvL1FcclxuICAgICAgICAweDE2ODksIDB4MTNiZSwgMHgxY2U3LCAweDE5ZDAsIDB4MDc2MiwgMHgwMjU1LCAweDBkMGMsIDB4MDgzYiAgICAvL0hcclxuICAgIF07XHJcblxyXG4gICAgLy8gNCBwZXIgdmVyc2lvbjogbnVtYmVyIG9mIGJsb2NrcyAxLDI7IGRhdGEgd2lkdGg7IGVjYyB3aWR0aFxyXG4gICAgdmFyIGVjY2Jsb2NrcyA9IFtcclxuICAgICAgICAxLCAwLCAxOSwgNywgMSwgMCwgMTYsIDEwLCAxLCAwLCAxMywgMTMsIDEsIDAsIDksIDE3LFxyXG4gICAgICAgIDEsIDAsIDM0LCAxMCwgMSwgMCwgMjgsIDE2LCAxLCAwLCAyMiwgMjIsIDEsIDAsIDE2LCAyOCxcclxuICAgICAgICAxLCAwLCA1NSwgMTUsIDEsIDAsIDQ0LCAyNiwgMiwgMCwgMTcsIDE4LCAyLCAwLCAxMywgMjIsXHJcbiAgICAgICAgMSwgMCwgODAsIDIwLCAyLCAwLCAzMiwgMTgsIDIsIDAsIDI0LCAyNiwgNCwgMCwgOSwgMTYsXHJcbiAgICAgICAgMSwgMCwgMTA4LCAyNiwgMiwgMCwgNDMsIDI0LCAyLCAyLCAxNSwgMTgsIDIsIDIsIDExLCAyMixcclxuICAgICAgICAyLCAwLCA2OCwgMTgsIDQsIDAsIDI3LCAxNiwgNCwgMCwgMTksIDI0LCA0LCAwLCAxNSwgMjgsXHJcbiAgICAgICAgMiwgMCwgNzgsIDIwLCA0LCAwLCAzMSwgMTgsIDIsIDQsIDE0LCAxOCwgNCwgMSwgMTMsIDI2LFxyXG4gICAgICAgIDIsIDAsIDk3LCAyNCwgMiwgMiwgMzgsIDIyLCA0LCAyLCAxOCwgMjIsIDQsIDIsIDE0LCAyNixcclxuICAgICAgICAyLCAwLCAxMTYsIDMwLCAzLCAyLCAzNiwgMjIsIDQsIDQsIDE2LCAyMCwgNCwgNCwgMTIsIDI0LFxyXG4gICAgICAgIDIsIDIsIDY4LCAxOCwgNCwgMSwgNDMsIDI2LCA2LCAyLCAxOSwgMjQsIDYsIDIsIDE1LCAyOCxcclxuICAgICAgICA0LCAwLCA4MSwgMjAsIDEsIDQsIDUwLCAzMCwgNCwgNCwgMjIsIDI4LCAzLCA4LCAxMiwgMjQsXHJcbiAgICAgICAgMiwgMiwgOTIsIDI0LCA2LCAyLCAzNiwgMjIsIDQsIDYsIDIwLCAyNiwgNywgNCwgMTQsIDI4LFxyXG4gICAgICAgIDQsIDAsIDEwNywgMjYsIDgsIDEsIDM3LCAyMiwgOCwgNCwgMjAsIDI0LCAxMiwgNCwgMTEsIDIyLFxyXG4gICAgICAgIDMsIDEsIDExNSwgMzAsIDQsIDUsIDQwLCAyNCwgMTEsIDUsIDE2LCAyMCwgMTEsIDUsIDEyLCAyNCxcclxuICAgICAgICA1LCAxLCA4NywgMjIsIDUsIDUsIDQxLCAyNCwgNSwgNywgMjQsIDMwLCAxMSwgNywgMTIsIDI0LFxyXG4gICAgICAgIDUsIDEsIDk4LCAyNCwgNywgMywgNDUsIDI4LCAxNSwgMiwgMTksIDI0LCAzLCAxMywgMTUsIDMwLFxyXG4gICAgICAgIDEsIDUsIDEwNywgMjgsIDEwLCAxLCA0NiwgMjgsIDEsIDE1LCAyMiwgMjgsIDIsIDE3LCAxNCwgMjgsXHJcbiAgICAgICAgNSwgMSwgMTIwLCAzMCwgOSwgNCwgNDMsIDI2LCAxNywgMSwgMjIsIDI4LCAyLCAxOSwgMTQsIDI4LFxyXG4gICAgICAgIDMsIDQsIDExMywgMjgsIDMsIDExLCA0NCwgMjYsIDE3LCA0LCAyMSwgMjYsIDksIDE2LCAxMywgMjYsXHJcbiAgICAgICAgMywgNSwgMTA3LCAyOCwgMywgMTMsIDQxLCAyNiwgMTUsIDUsIDI0LCAzMCwgMTUsIDEwLCAxNSwgMjgsXHJcbiAgICAgICAgNCwgNCwgMTE2LCAyOCwgMTcsIDAsIDQyLCAyNiwgMTcsIDYsIDIyLCAyOCwgMTksIDYsIDE2LCAzMCxcclxuICAgICAgICAyLCA3LCAxMTEsIDI4LCAxNywgMCwgNDYsIDI4LCA3LCAxNiwgMjQsIDMwLCAzNCwgMCwgMTMsIDI0LFxyXG4gICAgICAgIDQsIDUsIDEyMSwgMzAsIDQsIDE0LCA0NywgMjgsIDExLCAxNCwgMjQsIDMwLCAxNiwgMTQsIDE1LCAzMCxcclxuICAgICAgICA2LCA0LCAxMTcsIDMwLCA2LCAxNCwgNDUsIDI4LCAxMSwgMTYsIDI0LCAzMCwgMzAsIDIsIDE2LCAzMCxcclxuICAgICAgICA4LCA0LCAxMDYsIDI2LCA4LCAxMywgNDcsIDI4LCA3LCAyMiwgMjQsIDMwLCAyMiwgMTMsIDE1LCAzMCxcclxuICAgICAgICAxMCwgMiwgMTE0LCAyOCwgMTksIDQsIDQ2LCAyOCwgMjgsIDYsIDIyLCAyOCwgMzMsIDQsIDE2LCAzMCxcclxuICAgICAgICA4LCA0LCAxMjIsIDMwLCAyMiwgMywgNDUsIDI4LCA4LCAyNiwgMjMsIDMwLCAxMiwgMjgsIDE1LCAzMCxcclxuICAgICAgICAzLCAxMCwgMTE3LCAzMCwgMywgMjMsIDQ1LCAyOCwgNCwgMzEsIDI0LCAzMCwgMTEsIDMxLCAxNSwgMzAsXHJcbiAgICAgICAgNywgNywgMTE2LCAzMCwgMjEsIDcsIDQ1LCAyOCwgMSwgMzcsIDIzLCAzMCwgMTksIDI2LCAxNSwgMzAsXHJcbiAgICAgICAgNSwgMTAsIDExNSwgMzAsIDE5LCAxMCwgNDcsIDI4LCAxNSwgMjUsIDI0LCAzMCwgMjMsIDI1LCAxNSwgMzAsXHJcbiAgICAgICAgMTMsIDMsIDExNSwgMzAsIDIsIDI5LCA0NiwgMjgsIDQyLCAxLCAyNCwgMzAsIDIzLCAyOCwgMTUsIDMwLFxyXG4gICAgICAgIDE3LCAwLCAxMTUsIDMwLCAxMCwgMjMsIDQ2LCAyOCwgMTAsIDM1LCAyNCwgMzAsIDE5LCAzNSwgMTUsIDMwLFxyXG4gICAgICAgIDE3LCAxLCAxMTUsIDMwLCAxNCwgMjEsIDQ2LCAyOCwgMjksIDE5LCAyNCwgMzAsIDExLCA0NiwgMTUsIDMwLFxyXG4gICAgICAgIDEzLCA2LCAxMTUsIDMwLCAxNCwgMjMsIDQ2LCAyOCwgNDQsIDcsIDI0LCAzMCwgNTksIDEsIDE2LCAzMCxcclxuICAgICAgICAxMiwgNywgMTIxLCAzMCwgMTIsIDI2LCA0NywgMjgsIDM5LCAxNCwgMjQsIDMwLCAyMiwgNDEsIDE1LCAzMCxcclxuICAgICAgICA2LCAxNCwgMTIxLCAzMCwgNiwgMzQsIDQ3LCAyOCwgNDYsIDEwLCAyNCwgMzAsIDIsIDY0LCAxNSwgMzAsXHJcbiAgICAgICAgMTcsIDQsIDEyMiwgMzAsIDI5LCAxNCwgNDYsIDI4LCA0OSwgMTAsIDI0LCAzMCwgMjQsIDQ2LCAxNSwgMzAsXHJcbiAgICAgICAgNCwgMTgsIDEyMiwgMzAsIDEzLCAzMiwgNDYsIDI4LCA0OCwgMTQsIDI0LCAzMCwgNDIsIDMyLCAxNSwgMzAsXHJcbiAgICAgICAgMjAsIDQsIDExNywgMzAsIDQwLCA3LCA0NywgMjgsIDQzLCAyMiwgMjQsIDMwLCAxMCwgNjcsIDE1LCAzMCxcclxuICAgICAgICAxOSwgNiwgMTE4LCAzMCwgMTgsIDMxLCA0NywgMjgsIDM0LCAzNCwgMjQsIDMwLCAyMCwgNjEsIDE1LCAzMFxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBHYWxvaXMgZmllbGQgbG9nIHRhYmxlXHJcbiAgICB2YXIgZ2xvZyA9IFtcclxuICAgICAgICAweGZmLCAweDAwLCAweDAxLCAweDE5LCAweDAyLCAweDMyLCAweDFhLCAweGM2LCAweDAzLCAweGRmLCAweDMzLCAweGVlLCAweDFiLCAweDY4LCAweGM3LCAweDRiLFxyXG4gICAgICAgIDB4MDQsIDB4NjQsIDB4ZTAsIDB4MGUsIDB4MzQsIDB4OGQsIDB4ZWYsIDB4ODEsIDB4MWMsIDB4YzEsIDB4NjksIDB4ZjgsIDB4YzgsIDB4MDgsIDB4NGMsIDB4NzEsXHJcbiAgICAgICAgMHgwNSwgMHg4YSwgMHg2NSwgMHgyZiwgMHhlMSwgMHgyNCwgMHgwZiwgMHgyMSwgMHgzNSwgMHg5MywgMHg4ZSwgMHhkYSwgMHhmMCwgMHgxMiwgMHg4MiwgMHg0NSxcclxuICAgICAgICAweDFkLCAweGI1LCAweGMyLCAweDdkLCAweDZhLCAweDI3LCAweGY5LCAweGI5LCAweGM5LCAweDlhLCAweDA5LCAweDc4LCAweDRkLCAweGU0LCAweDcyLCAweGE2LFxyXG4gICAgICAgIDB4MDYsIDB4YmYsIDB4OGIsIDB4NjIsIDB4NjYsIDB4ZGQsIDB4MzAsIDB4ZmQsIDB4ZTIsIDB4OTgsIDB4MjUsIDB4YjMsIDB4MTAsIDB4OTEsIDB4MjIsIDB4ODgsXHJcbiAgICAgICAgMHgzNiwgMHhkMCwgMHg5NCwgMHhjZSwgMHg4ZiwgMHg5NiwgMHhkYiwgMHhiZCwgMHhmMSwgMHhkMiwgMHgxMywgMHg1YywgMHg4MywgMHgzOCwgMHg0NiwgMHg0MCxcclxuICAgICAgICAweDFlLCAweDQyLCAweGI2LCAweGEzLCAweGMzLCAweDQ4LCAweDdlLCAweDZlLCAweDZiLCAweDNhLCAweDI4LCAweDU0LCAweGZhLCAweDg1LCAweGJhLCAweDNkLFxyXG4gICAgICAgIDB4Y2EsIDB4NWUsIDB4OWIsIDB4OWYsIDB4MGEsIDB4MTUsIDB4NzksIDB4MmIsIDB4NGUsIDB4ZDQsIDB4ZTUsIDB4YWMsIDB4NzMsIDB4ZjMsIDB4YTcsIDB4NTcsXHJcbiAgICAgICAgMHgwNywgMHg3MCwgMHhjMCwgMHhmNywgMHg4YywgMHg4MCwgMHg2MywgMHgwZCwgMHg2NywgMHg0YSwgMHhkZSwgMHhlZCwgMHgzMSwgMHhjNSwgMHhmZSwgMHgxOCxcclxuICAgICAgICAweGUzLCAweGE1LCAweDk5LCAweDc3LCAweDI2LCAweGI4LCAweGI0LCAweDdjLCAweDExLCAweDQ0LCAweDkyLCAweGQ5LCAweDIzLCAweDIwLCAweDg5LCAweDJlLFxyXG4gICAgICAgIDB4MzcsIDB4M2YsIDB4ZDEsIDB4NWIsIDB4OTUsIDB4YmMsIDB4Y2YsIDB4Y2QsIDB4OTAsIDB4ODcsIDB4OTcsIDB4YjIsIDB4ZGMsIDB4ZmMsIDB4YmUsIDB4NjEsXHJcbiAgICAgICAgMHhmMiwgMHg1NiwgMHhkMywgMHhhYiwgMHgxNCwgMHgyYSwgMHg1ZCwgMHg5ZSwgMHg4NCwgMHgzYywgMHgzOSwgMHg1MywgMHg0NywgMHg2ZCwgMHg0MSwgMHhhMixcclxuICAgICAgICAweDFmLCAweDJkLCAweDQzLCAweGQ4LCAweGI3LCAweDdiLCAweGE0LCAweDc2LCAweGM0LCAweDE3LCAweDQ5LCAweGVjLCAweDdmLCAweDBjLCAweDZmLCAweGY2LFxyXG4gICAgICAgIDB4NmMsIDB4YTEsIDB4M2IsIDB4NTIsIDB4MjksIDB4OWQsIDB4NTUsIDB4YWEsIDB4ZmIsIDB4NjAsIDB4ODYsIDB4YjEsIDB4YmIsIDB4Y2MsIDB4M2UsIDB4NWEsXHJcbiAgICAgICAgMHhjYiwgMHg1OSwgMHg1ZiwgMHhiMCwgMHg5YywgMHhhOSwgMHhhMCwgMHg1MSwgMHgwYiwgMHhmNSwgMHgxNiwgMHhlYiwgMHg3YSwgMHg3NSwgMHgyYywgMHhkNyxcclxuICAgICAgICAweDRmLCAweGFlLCAweGQ1LCAweGU5LCAweGU2LCAweGU3LCAweGFkLCAweGU4LCAweDc0LCAweGQ2LCAweGY0LCAweGVhLCAweGE4LCAweDUwLCAweDU4LCAweGFmXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIEdhbGlvcyBmaWVsZCBleHBvbmVudCB0YWJsZVxyXG4gICAgdmFyIGdleHAgPSBbXHJcbiAgICAgICAgMHgwMSwgMHgwMiwgMHgwNCwgMHgwOCwgMHgxMCwgMHgyMCwgMHg0MCwgMHg4MCwgMHgxZCwgMHgzYSwgMHg3NCwgMHhlOCwgMHhjZCwgMHg4NywgMHgxMywgMHgyNixcclxuICAgICAgICAweDRjLCAweDk4LCAweDJkLCAweDVhLCAweGI0LCAweDc1LCAweGVhLCAweGM5LCAweDhmLCAweDAzLCAweDA2LCAweDBjLCAweDE4LCAweDMwLCAweDYwLCAweGMwLFxyXG4gICAgICAgIDB4OWQsIDB4MjcsIDB4NGUsIDB4OWMsIDB4MjUsIDB4NGEsIDB4OTQsIDB4MzUsIDB4NmEsIDB4ZDQsIDB4YjUsIDB4NzcsIDB4ZWUsIDB4YzEsIDB4OWYsIDB4MjMsXHJcbiAgICAgICAgMHg0NiwgMHg4YywgMHgwNSwgMHgwYSwgMHgxNCwgMHgyOCwgMHg1MCwgMHhhMCwgMHg1ZCwgMHhiYSwgMHg2OSwgMHhkMiwgMHhiOSwgMHg2ZiwgMHhkZSwgMHhhMSxcclxuICAgICAgICAweDVmLCAweGJlLCAweDYxLCAweGMyLCAweDk5LCAweDJmLCAweDVlLCAweGJjLCAweDY1LCAweGNhLCAweDg5LCAweDBmLCAweDFlLCAweDNjLCAweDc4LCAweGYwLFxyXG4gICAgICAgIDB4ZmQsIDB4ZTcsIDB4ZDMsIDB4YmIsIDB4NmIsIDB4ZDYsIDB4YjEsIDB4N2YsIDB4ZmUsIDB4ZTEsIDB4ZGYsIDB4YTMsIDB4NWIsIDB4YjYsIDB4NzEsIDB4ZTIsXHJcbiAgICAgICAgMHhkOSwgMHhhZiwgMHg0MywgMHg4NiwgMHgxMSwgMHgyMiwgMHg0NCwgMHg4OCwgMHgwZCwgMHgxYSwgMHgzNCwgMHg2OCwgMHhkMCwgMHhiZCwgMHg2NywgMHhjZSxcclxuICAgICAgICAweDgxLCAweDFmLCAweDNlLCAweDdjLCAweGY4LCAweGVkLCAweGM3LCAweDkzLCAweDNiLCAweDc2LCAweGVjLCAweGM1LCAweDk3LCAweDMzLCAweDY2LCAweGNjLFxyXG4gICAgICAgIDB4ODUsIDB4MTcsIDB4MmUsIDB4NWMsIDB4YjgsIDB4NmQsIDB4ZGEsIDB4YTksIDB4NGYsIDB4OWUsIDB4MjEsIDB4NDIsIDB4ODQsIDB4MTUsIDB4MmEsIDB4NTQsXHJcbiAgICAgICAgMHhhOCwgMHg0ZCwgMHg5YSwgMHgyOSwgMHg1MiwgMHhhNCwgMHg1NSwgMHhhYSwgMHg0OSwgMHg5MiwgMHgzOSwgMHg3MiwgMHhlNCwgMHhkNSwgMHhiNywgMHg3MyxcclxuICAgICAgICAweGU2LCAweGQxLCAweGJmLCAweDYzLCAweGM2LCAweDkxLCAweDNmLCAweDdlLCAweGZjLCAweGU1LCAweGQ3LCAweGIzLCAweDdiLCAweGY2LCAweGYxLCAweGZmLFxyXG4gICAgICAgIDB4ZTMsIDB4ZGIsIDB4YWIsIDB4NGIsIDB4OTYsIDB4MzEsIDB4NjIsIDB4YzQsIDB4OTUsIDB4MzcsIDB4NmUsIDB4ZGMsIDB4YTUsIDB4NTcsIDB4YWUsIDB4NDEsXHJcbiAgICAgICAgMHg4MiwgMHgxOSwgMHgzMiwgMHg2NCwgMHhjOCwgMHg4ZCwgMHgwNywgMHgwZSwgMHgxYywgMHgzOCwgMHg3MCwgMHhlMCwgMHhkZCwgMHhhNywgMHg1MywgMHhhNixcclxuICAgICAgICAweDUxLCAweGEyLCAweDU5LCAweGIyLCAweDc5LCAweGYyLCAweGY5LCAweGVmLCAweGMzLCAweDliLCAweDJiLCAweDU2LCAweGFjLCAweDQ1LCAweDhhLCAweDA5LFxyXG4gICAgICAgIDB4MTIsIDB4MjQsIDB4NDgsIDB4OTAsIDB4M2QsIDB4N2EsIDB4ZjQsIDB4ZjUsIDB4ZjcsIDB4ZjMsIDB4ZmIsIDB4ZWIsIDB4Y2IsIDB4OGIsIDB4MGIsIDB4MTYsXHJcbiAgICAgICAgMHgyYywgMHg1OCwgMHhiMCwgMHg3ZCwgMHhmYSwgMHhlOSwgMHhjZiwgMHg4MywgMHgxYiwgMHgzNiwgMHg2YywgMHhkOCwgMHhhZCwgMHg0NywgMHg4ZSwgMHgwMFxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBXb3JraW5nIGJ1ZmZlcnM6XHJcbiAgICAvLyBkYXRhIGlucHV0IGFuZCBlY2MgYXBwZW5kLCBpbWFnZSB3b3JraW5nIGJ1ZmZlciwgZml4ZWQgcGFydCBvZiBpbWFnZSwgcnVuIGxlbmd0aHMgZm9yIGJhZG5lc3NcclxuICAgIHZhciBzdHJpbmJ1Zj1bXSwgZWNjYnVmPVtdLCBxcmZyYW1lPVtdLCBmcmFtYXNrPVtdLCBybGVucz1bXTsgXHJcbiAgICAvLyBDb250cm9sIHZhbHVlcyAtIHdpZHRoIGlzIGJhc2VkIG9uIHZlcnNpb24sIGxhc3QgNCBhcmUgZnJvbSB0YWJsZS5cclxuICAgIHZhciB2ZXJzaW9uLCB3aWR0aCwgbmVjY2JsazEsIG5lY2NibGsyLCBkYXRhYmxrdywgZWNjYmxrd2lkO1xyXG4gICAgdmFyIGVjY2xldmVsID0gMjtcclxuICAgIC8vIHNldCBiaXQgdG8gaW5kaWNhdGUgY2VsbCBpbiBxcmZyYW1lIGlzIGltbXV0YWJsZS4gIHN5bW1ldHJpYyBhcm91bmQgZGlhZ29uYWxcclxuICAgIGZ1bmN0aW9uIHNldG1hc2soeCwgeSlcclxuICAgIHtcclxuICAgICAgICB2YXIgYnQ7XHJcbiAgICAgICAgaWYgKHggPiB5KSB7XHJcbiAgICAgICAgICAgIGJ0ID0geDtcclxuICAgICAgICAgICAgeCA9IHk7XHJcbiAgICAgICAgICAgIHkgPSBidDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8geSp5ID0gMSszKzUuLi5cclxuICAgICAgICBidCA9IHk7XHJcbiAgICAgICAgYnQgKj0geTtcclxuICAgICAgICBidCArPSB5O1xyXG4gICAgICAgIGJ0ID4+PSAxO1xyXG4gICAgICAgIGJ0ICs9IHg7XHJcbiAgICAgICAgZnJhbWFza1tidF0gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVudGVyIGFsaWdubWVudCBwYXR0ZXJuIC0gYmxhY2sgdG8gcXJmcmFtZSwgd2hpdGUgdG8gbWFzayAobGF0ZXIgYmxhY2sgZnJhbWUgbWVyZ2VkIHRvIG1hc2spXHJcbiAgICBmdW5jdGlvbiBwdXRhbGlnbih4LCB5KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBqO1xyXG5cclxuICAgICAgICBxcmZyYW1lW3ggKyB3aWR0aCAqIHldID0gMTtcclxuICAgICAgICBmb3IgKGogPSAtMjsgaiA8IDI7IGorKykge1xyXG4gICAgICAgICAgICBxcmZyYW1lWyh4ICsgaikgKyB3aWR0aCAqICh5IC0gMildID0gMTtcclxuICAgICAgICAgICAgcXJmcmFtZVsoeCAtIDIpICsgd2lkdGggKiAoeSArIGogKyAxKV0gPSAxO1xyXG4gICAgICAgICAgICBxcmZyYW1lWyh4ICsgMikgKyB3aWR0aCAqICh5ICsgaildID0gMTtcclxuICAgICAgICAgICAgcXJmcmFtZVsoeCArIGogKyAxKSArIHdpZHRoICogKHkgKyAyKV0gPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgMjsgaisrKSB7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCAtIDEsIHkgKyBqKTtcclxuICAgICAgICAgICAgc2V0bWFzayh4ICsgMSwgeSAtIGopO1xyXG4gICAgICAgICAgICBzZXRtYXNrKHggLSBqLCB5IC0gMSk7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCArIGosIHkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFJlZWQgU29sb21vbiBlcnJvciBjb3JyZWN0aW9uXHJcbiAgICAvLyBleHBvbmVudGlhdGlvbiBtb2QgTlxyXG4gICAgZnVuY3Rpb24gbW9kbm4oeClcclxuICAgIHtcclxuICAgICAgICB3aGlsZSAoeCA+PSAyNTUpIHtcclxuICAgICAgICAgICAgeCAtPSAyNTU7XHJcbiAgICAgICAgICAgIHggPSAoeCA+PiA4KSArICh4ICYgMjU1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdlbnBvbHkgPSBbXTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgYW5kIGFwcGVuZCBFQ0MgZGF0YSB0byBkYXRhIGJsb2NrLiAgQmxvY2sgaXMgaW4gc3RyaW5idWYsIGluZGV4ZXMgdG8gYnVmZmVycyBnaXZlbi5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZHJzKGRhdGEsIGRsZW4sIGVjYnVmLCBlY2xlbilcclxuICAgIHtcclxuICAgICAgICB2YXIgaSwgaiwgZmI7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBlY2xlbjsgaSsrKVxyXG4gICAgICAgICAgICBzdHJpbmJ1ZltlY2J1ZiArIGldID0gMDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZiID0gZ2xvZ1tzdHJpbmJ1ZltkYXRhICsgaV0gXiBzdHJpbmJ1ZltlY2J1Zl1dO1xyXG4gICAgICAgICAgICBpZiAoZmIgIT0gMjU1KSAgICAgLyogZmIgdGVybSBpcyBub24temVybyAqL1xyXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMTsgaiA8IGVjbGVuOyBqKyspXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5idWZbZWNidWYgKyBqIC0gMV0gPSBzdHJpbmJ1ZltlY2J1ZiArIGpdIF4gZ2V4cFttb2RubihmYiArIGdlbnBvbHlbZWNsZW4gLSBqXSldO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBmb3IoIGogPSBlY2J1ZiA7IGogPCBlY2J1ZiArIGVjbGVuOyBqKysgKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluYnVmW2pdID0gc3RyaW5idWZbaiArIDFdO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZlsgZWNidWYgKyBlY2xlbiAtIDFdID0gZmIgPT0gMjU1ID8gMCA6IGdleHBbbW9kbm4oZmIgKyBnZW5wb2x5WzBdKV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBGcmFtZSBkYXRhIGluc2VydCBmb2xsb3dpbmcgdGhlIHBhdGggcnVsZXNcclxuXHJcbiAgICAvLyBjaGVjayBtYXNrIC0gc2luY2Ugc3ltbWV0cmljYWwgdXNlIGhhbGYuXHJcbiAgICBmdW5jdGlvbiBpc21hc2tlZCh4LCB5KVxyXG4gICAge1xyXG4gICAgICAgIHZhciBidDtcclxuICAgICAgICBpZiAoeCA+IHkpIHtcclxuICAgICAgICAgICAgYnQgPSB4O1xyXG4gICAgICAgICAgICB4ID0geTtcclxuICAgICAgICAgICAgeSA9IGJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBidCA9IHk7XHJcbiAgICAgICAgYnQgKz0geSAqIHk7XHJcbiAgICAgICAgYnQgPj49IDE7XHJcbiAgICAgICAgYnQgKz0geDtcclxuICAgICAgICByZXR1cm4gZnJhbWFza1tidF07XHJcbiAgICB9XHJcblxyXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vICBBcHBseSB0aGUgc2VsZWN0ZWQgbWFzayBvdXQgb2YgdGhlIDguXHJcbiAgICBmdW5jdGlvbiAgYXBwbHltYXNrKG0pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHgsIHksIHIzeCwgcjN5O1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG0pIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKVxyXG4gICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoKHggKyB5KSAmIDEpICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKVxyXG4gICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoeSAmIDEpICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKVxyXG4gICAgICAgICAgICAgICAgZm9yIChyM3ggPSAwLCB4ID0gMDsgeCA8IHdpZHRoOyB4KyssIHIzeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIzeCA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByM3ggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcjN4ICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIGZvciAocjN5ID0gMCwgeSA9IDA7IHkgPCB3aWR0aDsgeSsrLCByM3krKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHIzeSA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgIHIzeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHIzeCA9IHIzeSwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXIzeCAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKVxyXG4gICAgICAgICAgICAgICAgZm9yIChyM3ggPSAwLCByM3kgPSAoKHkgPj4gMSkgJiAxKSwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByM3ggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByM3kgPSAhcjN5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXIzeSAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICBmb3IgKHIzeSA9IDAsIHkgPSAwOyB5IDwgd2lkdGg7IHkrKywgcjN5KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChyM3kgPT0gMylcclxuICAgICAgICAgICAgICAgICAgICByM3kgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChyM3ggPSAwLCB4ID0gMDsgeCA8IHdpZHRoOyB4KyssIHIzeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIzeCA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByM3ggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKCh4ICYgeSAmIDEpICsgISghcjN4IHwgIXIzeSkpICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgZm9yIChyM3kgPSAwLCB5ID0gMDsgeSA8IHdpZHRoOyB5KyssIHIzeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocjN5ID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgcjN5ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAocjN4ID0gMCwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISgoKHggJiB5ICYgMSkgKyAocjN4ICYmIChyM3ggPT0gcjN5KSkpICYgMSkgJiYgIWlzbWFza2VkKHgsIHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxcmZyYW1lW3ggKyB5ICogd2lkdGhdIF49IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICBmb3IgKHIzeSA9IDAsIHkgPSAwOyB5IDwgd2lkdGg7IHkrKywgcjN5KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChyM3kgPT0gMylcclxuICAgICAgICAgICAgICAgICAgICByM3kgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChyM3ggPSAwLCB4ID0gMDsgeCA8IHdpZHRoOyB4KyssIHIzeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIzeCA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByM3ggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKCgocjN4ICYmIChyM3ggPT0gcjN5KSkgKyAoKHggKyB5KSAmIDEpKSAmIDEpICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQmFkbmVzcyBjb2VmZmljaWVudHMuXHJcbiAgICB2YXIgTjEgPSAzLCBOMiA9IDMsIE4zID0gNDAsIE40ID0gMTA7XHJcblxyXG4gICAgLy8gVXNpbmcgdGhlIHRhYmxlIG9mIHRoZSBsZW5ndGggb2YgZWFjaCBydW4sIGNhbGN1bGF0ZSB0aGUgYW1vdW50IG9mIGJhZCBpbWFnZSBcclxuICAgIC8vIC0gbG9uZyBydW5zIG9yIHRob3NlIHRoYXQgbG9vayBsaWtlIGZpbmRlcnM7IGNhbGxlZCB0d2ljZSwgb25jZSBlYWNoIGZvciBYIGFuZCBZXHJcbiAgICBmdW5jdGlvbiBiYWRydW5zKGxlbmd0aClcclxuICAgIHtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICB2YXIgcnVuc2JhZCA9IDA7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8PSBsZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgaWYgKHJsZW5zW2ldID49IDUpXHJcbiAgICAgICAgICAgICAgICBydW5zYmFkICs9IE4xICsgcmxlbnNbaV0gLSA1O1xyXG4gICAgICAgIC8vIEJ3QkJCd0IgYXMgaW4gZmluZGVyXHJcbiAgICAgICAgZm9yIChpID0gMzsgaSA8IGxlbmd0aCAtIDE7IGkgKz0gMilcclxuICAgICAgICAgICAgaWYgKHJsZW5zW2kgLSAyXSA9PSBybGVuc1tpICsgMl1cclxuICAgICAgICAgICAgICAgICYmIHJsZW5zW2kgKyAyXSA9PSBybGVuc1tpIC0gMV1cclxuICAgICAgICAgICAgICAgICYmIHJsZW5zW2kgLSAxXSA9PSBybGVuc1tpICsgMV1cclxuICAgICAgICAgICAgICAgICYmIHJsZW5zW2kgLSAxXSAqIDMgPT0gcmxlbnNbaV1cclxuICAgICAgICAgICAgICAgIC8vIHdoaXRlIGFyb3VuZCB0aGUgYmxhY2sgcGF0dGVybj8gTm90IHBhcnQgb2Ygc3BlY1xyXG4gICAgICAgICAgICAgICAgJiYgKHJsZW5zW2kgLSAzXSA9PSAwIC8vIGJlZ2lubmluZ1xyXG4gICAgICAgICAgICAgICAgICAgIHx8IGkgKyAzID4gbGVuZ3RoICAvLyBlbmRcclxuICAgICAgICAgICAgICAgICAgICB8fCBybGVuc1tpIC0gM10gKiAzID49IHJsZW5zW2ldICogNCB8fCBybGVuc1tpICsgM10gKiAzID49IHJsZW5zW2ldICogNClcclxuICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgcnVuc2JhZCArPSBOMztcclxuICAgICAgICByZXR1cm4gcnVuc2JhZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgaG93IGJhZCB0aGUgbWFza2VkIGltYWdlIGlzIC0gYmxvY2tzLCBpbWJhbGFuY2UsIHJ1bnMsIG9yIGZpbmRlcnMuXHJcbiAgICBmdW5jdGlvbiBiYWRjaGVjaygpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHgsIHksIGgsIGIsIGIxO1xyXG4gICAgICAgIHZhciB0aGlzYmFkID0gMDtcclxuICAgICAgICB2YXIgYncgPSAwO1xyXG5cclxuICAgICAgICAvLyBibG9ja3Mgb2Ygc2FtZSBjb2xvci5cclxuICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGggLSAxOyB5KyspXHJcbiAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCB3aWR0aCAtIDE7IHgrKylcclxuICAgICAgICAgICAgICAgIGlmICgocXJmcmFtZVt4ICsgd2lkdGggKiB5XSAmJiBxcmZyYW1lWyh4ICsgMSkgKyB3aWR0aCAqIHldXHJcbiAgICAgICAgICAgICAgICAgICAgICYmIHFyZnJhbWVbeCArIHdpZHRoICogKHkgKyAxKV0gJiYgcXJmcmFtZVsoeCArIDEpICsgd2lkdGggKiAoeSArIDEpXSkgLy8gYWxsIGJsYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgIShxcmZyYW1lW3ggKyB3aWR0aCAqIHldIHx8IHFyZnJhbWVbKHggKyAxKSArIHdpZHRoICogeV1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHFyZnJhbWVbeCArIHdpZHRoICogKHkgKyAxKV0gfHwgcXJmcmFtZVsoeCArIDEpICsgd2lkdGggKiAoeSArIDEpXSkpIC8vIGFsbCB3aGl0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNiYWQgKz0gTjI7XHJcblxyXG4gICAgICAgIC8vIFggcnVuc1xyXG4gICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgIHJsZW5zWzBdID0gMDtcclxuICAgICAgICAgICAgZm9yIChoID0gYiA9IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChiMSA9IHFyZnJhbWVbeCArIHdpZHRoICogeV0pID09IGIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmxlbnNbaF0rKztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBybGVuc1srK2hdID0gMTtcclxuICAgICAgICAgICAgICAgIGIgPSBiMTtcclxuICAgICAgICAgICAgICAgIGJ3ICs9IGIgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpc2JhZCArPSBiYWRydW5zKGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYmxhY2svd2hpdGUgaW1iYWxhbmNlXHJcbiAgICAgICAgaWYgKGJ3IDwgMClcclxuICAgICAgICAgICAgYncgPSAtYnc7XHJcblxyXG4gICAgICAgIHZhciBiaWcgPSBidztcclxuICAgICAgICB2YXIgY291bnQgPSAwO1xyXG4gICAgICAgIGJpZyArPSBiaWcgPDwgMjtcclxuICAgICAgICBiaWcgPDw9IDE7XHJcbiAgICAgICAgd2hpbGUgKGJpZyA+IHdpZHRoICogd2lkdGgpXHJcbiAgICAgICAgICAgIGJpZyAtPSB3aWR0aCAqIHdpZHRoLCBjb3VudCsrO1xyXG4gICAgICAgIHRoaXNiYWQgKz0gY291bnQgKiBONDtcclxuXHJcbiAgICAgICAgLy8gWSBydW5zXHJcbiAgICAgICAgZm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgcmxlbnNbMF0gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGggPSBiID0geSA9IDA7IHkgPCB3aWR0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGIxID0gcXJmcmFtZVt4ICsgd2lkdGggKiB5XSkgPT0gYilcclxuICAgICAgICAgICAgICAgICAgICBybGVuc1toXSsrO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJsZW5zWysraF0gPSAxO1xyXG4gICAgICAgICAgICAgICAgYiA9IGIxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXNiYWQgKz0gYmFkcnVucyhoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNiYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZnJhbWUoaW5zdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHgsIHksIGssIHQsIHYsIGksIGosIG07XHJcblxyXG4gICAgLy8gZmluZCB0aGUgc21hbGxlc3QgdmVyc2lvbiB0aGF0IGZpdHMgdGhlIHN0cmluZ1xyXG4gICAgICAgIHQgPSBpbnN0cmluZy5sZW5ndGg7XHJcbiAgICAgICAgdmVyc2lvbiA9IDA7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB2ZXJzaW9uKys7XHJcbiAgICAgICAgICAgIGsgPSAoZWNjbGV2ZWwgLSAxKSAqIDQgKyAodmVyc2lvbiAtIDEpICogMTY7XHJcbiAgICAgICAgICAgIG5lY2NibGsxID0gZWNjYmxvY2tzW2srK107XHJcbiAgICAgICAgICAgIG5lY2NibGsyID0gZWNjYmxvY2tzW2srK107XHJcbiAgICAgICAgICAgIGRhdGFibGt3ID0gZWNjYmxvY2tzW2srK107XHJcbiAgICAgICAgICAgIGVjY2Jsa3dpZCA9IGVjY2Jsb2Nrc1trXTtcclxuICAgICAgICAgICAgayA9IGRhdGFibGt3ICogKG5lY2NibGsxICsgbmVjY2JsazIpICsgbmVjY2JsazIgLSAzICsgKHZlcnNpb24gPD0gOSk7XHJcbiAgICAgICAgICAgIGlmICh0IDw9IGspXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9IHdoaWxlICh2ZXJzaW9uIDwgNDApO1xyXG5cclxuICAgIC8vIEZJWE1FIC0gaW5zdXJlIHRoYXQgaXQgZml0cyBpbnN0ZWQgb2YgYmVpbmcgdHJ1bmNhdGVkXHJcbiAgICAgICAgd2lkdGggPSAxNyArIDQgKiB2ZXJzaW9uO1xyXG5cclxuICAgIC8vIGFsbG9jYXRlLCBjbGVhciBhbmQgc2V0dXAgZGF0YSBzdHJ1Y3R1cmVzXHJcbiAgICAgICAgdiA9IGRhdGFibGt3ICsgKGRhdGFibGt3ICsgZWNjYmxrd2lkKSAqIChuZWNjYmxrMSArIG5lY2NibGsyKSArIG5lY2NibGsyO1xyXG4gICAgICAgIGZvciggdCA9IDA7IHQgPCB2OyB0KysgKVxyXG4gICAgICAgICAgICBlY2NidWZbdF0gPSAwO1xyXG4gICAgICAgIHN0cmluYnVmID0gaW5zdHJpbmcuc2xpY2UoMCk7XHJcblxyXG4gICAgICAgIGZvciggdCA9IDA7IHQgPCB3aWR0aCAqIHdpZHRoOyB0KysgKVxyXG4gICAgICAgICAgICBxcmZyYW1lW3RdID0gMDtcclxuXHJcbiAgICAgICAgZm9yKCB0ID0gMCA7IHQgPCAod2lkdGggKiAod2lkdGggKyAxKSArIDEpIC8gMjsgdCsrKVxyXG4gICAgICAgICAgICBmcmFtYXNrW3RdID0gMDtcclxuXHJcbiAgICAvLyBpbnNlcnQgZmluZGVycyAtIGJsYWNrIHRvIGZyYW1lLCB3aGl0ZSB0byBtYXNrXHJcbiAgICAgICAgZm9yICh0ID0gMDsgdCA8IDM7IHQrKykge1xyXG4gICAgICAgICAgICBrID0gMDtcclxuICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0ID09IDEpXHJcbiAgICAgICAgICAgICAgICBrID0gKHdpZHRoIC0gNyk7XHJcbiAgICAgICAgICAgIGlmICh0ID09IDIpXHJcbiAgICAgICAgICAgICAgICB5ID0gKHdpZHRoIC0gNyk7XHJcbiAgICAgICAgICAgIHFyZnJhbWVbKHkgKyAzKSArIHdpZHRoICogKGsgKyAzKV0gPSAxO1xyXG4gICAgICAgICAgICBmb3IgKHggPSAwOyB4IDwgNjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lWyh5ICsgeCkgKyB3aWR0aCAqIGtdID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbeSArIHdpZHRoICogKGsgKyB4ICsgMSldID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHkgKyA2KSArIHdpZHRoICogKGsgKyB4KV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsoeSArIHggKyAxKSArIHdpZHRoICogKGsgKyA2KV0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoeCA9IDE7IHggPCA1OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHNldG1hc2soeSArIHgsIGsgKyAxKTtcclxuICAgICAgICAgICAgICAgIHNldG1hc2soeSArIDEsIGsgKyB4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKHkgKyA1LCBrICsgeCk7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKHkgKyB4ICsgMSwgayArIDUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoeCA9IDI7IHggPCA0OyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHkgKyB4KSArIHdpZHRoICogKGsgKyAyKV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsoeSArIDIpICsgd2lkdGggKiAoayArIHggKyAxKV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsoeSArIDQpICsgd2lkdGggKiAoayArIHgpXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lWyh5ICsgeCArIDEpICsgd2lkdGggKiAoayArIDQpXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gYWxpZ25tZW50IGJsb2Nrc1xyXG4gICAgICAgIGlmICh2ZXJzaW9uID4gMSkge1xyXG4gICAgICAgICAgICB0ID0gYWRlbHRhW3ZlcnNpb25dO1xyXG4gICAgICAgICAgICB5ID0gd2lkdGggLSA3O1xyXG4gICAgICAgICAgICBmb3IgKDs7KSB7XHJcbiAgICAgICAgICAgICAgICB4ID0gd2lkdGggLSA3O1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHggPiB0IC0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgIHB1dGFsaWduKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4IDwgdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgeCAtPSB0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHkgPD0gdCArIDkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB5IC09IHQ7XHJcbiAgICAgICAgICAgICAgICBwdXRhbGlnbig2LCB5KTtcclxuICAgICAgICAgICAgICAgIHB1dGFsaWduKHksIDYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIHNpbmdsZSBibGFja1xyXG4gICAgICAgIHFyZnJhbWVbOCArIHdpZHRoICogKHdpZHRoIC0gOCldID0gMTtcclxuXHJcbiAgICAvLyB0aW1pbmcgZ2FwIC0gbWFzayBvbmx5XHJcbiAgICAgICAgZm9yICh5ID0gMDsgeSA8IDc7IHkrKykge1xyXG4gICAgICAgICAgICBzZXRtYXNrKDcsIHkpO1xyXG4gICAgICAgICAgICBzZXRtYXNrKHdpZHRoIC0gOCwgeSk7XHJcbiAgICAgICAgICAgIHNldG1hc2soNywgeSArIHdpZHRoIC0gNyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCA4OyB4KyspIHtcclxuICAgICAgICAgICAgc2V0bWFzayh4LCA3KTtcclxuICAgICAgICAgICAgc2V0bWFzayh4ICsgd2lkdGggLSA4LCA3KTtcclxuICAgICAgICAgICAgc2V0bWFzayh4LCB3aWR0aCAtIDgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAvLyByZXNlcnZlIG1hc2stZm9ybWF0IGFyZWFcclxuICAgICAgICBmb3IgKHggPSAwOyB4IDwgOTsgeCsrKVxyXG4gICAgICAgICAgICBzZXRtYXNrKHgsIDgpO1xyXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCA4OyB4KyspIHtcclxuICAgICAgICAgICAgc2V0bWFzayh4ICsgd2lkdGggLSA4LCA4KTtcclxuICAgICAgICAgICAgc2V0bWFzayg4LCB4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh5ID0gMDsgeSA8IDc7IHkrKylcclxuICAgICAgICAgICAgc2V0bWFzayg4LCB5ICsgd2lkdGggLSA3KTtcclxuXHJcbiAgICAvLyB0aW1pbmcgcm93L2NvbFxyXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCB3aWR0aCAtIDE0OyB4KyspXHJcbiAgICAgICAgICAgIGlmICh4ICYgMSkge1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzayg4ICsgeCwgNik7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKDYsIDggKyB4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKDggKyB4KSArIHdpZHRoICogNl0gPSAxO1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVs2ICsgd2lkdGggKiAoOCArIHgpXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAvLyB2ZXJzaW9uIGJsb2NrXHJcbiAgICAgICAgaWYgKHZlcnNpb24gPiA2KSB7XHJcbiAgICAgICAgICAgIHQgPSB2cGF0W3ZlcnNpb24gLSA3XTtcclxuICAgICAgICAgICAgayA9IDE3O1xyXG4gICAgICAgICAgICBmb3IgKHggPSAwOyB4IDwgNjsgeCsrKVxyXG4gICAgICAgICAgICAgICAgZm9yICh5ID0gMDsgeSA8IDM7IHkrKywgay0tKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgxICYgKGsgPiAxMSA/IHZlcnNpb24gPj4gKGsgLSAxMikgOiB0ID4+IGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbKDUgLSB4KSArIHdpZHRoICogKDIgLSB5ICsgd2lkdGggLSAxMSldID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVsoMiAtIHkgKyB3aWR0aCAtIDExKSArIHdpZHRoICogKDUgLSB4KV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKDUgLSB4LCAyIC0geSArIHdpZHRoIC0gMTEpO1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzaygyIC0geSArIHdpZHRoIC0gMTEsIDUgLSB4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAvLyBzeW5jIG1hc2sgYml0cyAtIG9ubHkgc2V0IGFib3ZlIGZvciB3aGl0ZSBzcGFjZXMsIHNvIGFkZCBpbiBibGFjayBiaXRzXHJcbiAgICAgICAgZm9yICh5ID0gMDsgeSA8IHdpZHRoOyB5KyspXHJcbiAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPD0geTsgeCsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHFyZnJhbWVbeCArIHdpZHRoICogeV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0bWFzayh4LCB5KTtcclxuXHJcbiAgICAvLyBjb252ZXJ0IHN0cmluZyB0byBiaXRzdHJlYW1cclxuICAgIC8vIDggYml0IGRhdGEgdG8gUVItY29kZWQgOCBiaXQgZGF0YSAobnVtZXJpYyBvciBhbHBoYW51bSwgb3Iga2Fuamkgbm90IHN1cHBvcnRlZClcclxuICAgICAgICB2ID0gc3RyaW5idWYubGVuZ3RoO1xyXG5cclxuICAgIC8vIHN0cmluZyB0byBhcnJheVxyXG4gICAgICAgIGZvciggaSA9IDAgOyBpIDwgdjsgaSsrIClcclxuICAgICAgICAgICAgZWNjYnVmW2ldID0gc3RyaW5idWYuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBzdHJpbmJ1ZiA9IGVjY2J1Zi5zbGljZSgwKTtcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgbWF4IHN0cmluZyBsZW5ndGhcclxuICAgICAgICB4ID0gZGF0YWJsa3cgKiAobmVjY2JsazEgKyBuZWNjYmxrMikgKyBuZWNjYmxrMjtcclxuICAgICAgICBpZiAodiA+PSB4IC0gMikge1xyXG4gICAgICAgICAgICB2ID0geCAtIDI7XHJcbiAgICAgICAgICAgIGlmICh2ZXJzaW9uID4gOSlcclxuICAgICAgICAgICAgICAgIHYtLTtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gc2hpZnQgYW5kIHJlcGFjayB0byBpbnNlcnQgbGVuZ3RoIHByZWZpeFxyXG4gICAgICAgIGkgPSB2O1xyXG4gICAgICAgIGlmICh2ZXJzaW9uID4gOSkge1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZltpICsgMl0gPSAwO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZltpICsgM10gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB0ID0gc3RyaW5idWZbaV07XHJcbiAgICAgICAgICAgICAgICBzdHJpbmJ1ZltpICsgM10gfD0gMjU1ICYgKHQgPDwgNCk7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmJ1ZltpICsgMl0gPSB0ID4+IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5idWZbMl0gfD0gMjU1ICYgKHYgPDwgNCk7XHJcbiAgICAgICAgICAgIHN0cmluYnVmWzFdID0gdiA+PiA0O1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZlswXSA9IDB4NDAgfCAodiA+PiAxMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZltpICsgMV0gPSAwO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZltpICsgMl0gPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB0ID0gc3RyaW5idWZbaV07XHJcbiAgICAgICAgICAgICAgICBzdHJpbmJ1ZltpICsgMl0gfD0gMjU1ICYgKHQgPDwgNCk7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmJ1ZltpICsgMV0gPSB0ID4+IDQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RyaW5idWZbMV0gfD0gMjU1ICYgKHYgPDwgNCk7XHJcbiAgICAgICAgICAgIHN0cmluYnVmWzBdID0gMHg0MCB8ICh2ID4+IDQpO1xyXG4gICAgICAgIH1cclxuICAgIC8vIGZpbGwgdG8gZW5kIHdpdGggcGFkIHBhdHRlcm5cclxuICAgICAgICBpID0gdiArIDMgLSAodmVyc2lvbiA8IDEwKTtcclxuICAgICAgICB3aGlsZSAoaSA8IHgpIHtcclxuICAgICAgICAgICAgc3RyaW5idWZbaSsrXSA9IDB4ZWM7XHJcbiAgICAgICAgICAgIC8vIGJ1ZmZlciBoYXMgcm9vbSAgICBpZiAoaSA9PSB4KSAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZltpKytdID0gMHgxMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIGFuZCBhcHBlbmQgRUNDXHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIGdlbmVyYXRvciBwb2x5bm9taWFsXHJcbiAgICAgICAgZ2VucG9seVswXSA9IDE7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGVjY2Jsa3dpZDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGdlbnBvbHlbaSArIDFdID0gMTtcclxuICAgICAgICAgICAgZm9yIChqID0gaTsgaiA+IDA7IGotLSlcclxuICAgICAgICAgICAgICAgIGdlbnBvbHlbal0gPSBnZW5wb2x5W2pdXHJcbiAgICAgICAgICAgICAgICA/IGdlbnBvbHlbaiAtIDFdIF4gZ2V4cFttb2RubihnbG9nW2dlbnBvbHlbal1dICsgaSldIDogZ2VucG9seVtqIC0gMV07XHJcbiAgICAgICAgICAgIGdlbnBvbHlbMF0gPSBnZXhwW21vZG5uKGdsb2dbZ2VucG9seVswXV0gKyBpKV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPD0gZWNjYmxrd2lkOyBpKyspXHJcbiAgICAgICAgICAgIGdlbnBvbHlbaV0gPSBnbG9nW2dlbnBvbHlbaV1dOyAvLyB1c2UgbG9ncyBmb3IgZ2VucG9seVtdIHRvIHNhdmUgY2FsYyBzdGVwXHJcblxyXG4gICAgLy8gYXBwZW5kIGVjYyB0byBkYXRhIGJ1ZmZlclxyXG4gICAgICAgIGsgPSB4O1xyXG4gICAgICAgIHkgPSAwO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuZWNjYmxrMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFwcGVuZHJzKHksIGRhdGFibGt3LCBrLCBlY2NibGt3aWQpO1xyXG4gICAgICAgICAgICB5ICs9IGRhdGFibGt3O1xyXG4gICAgICAgICAgICBrICs9IGVjY2Jsa3dpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG5lY2NibGsyOyBpKyspIHtcclxuICAgICAgICAgICAgYXBwZW5kcnMoeSwgZGF0YWJsa3cgKyAxLCBrLCBlY2NibGt3aWQpO1xyXG4gICAgICAgICAgICB5ICs9IGRhdGFibGt3ICsgMTtcclxuICAgICAgICAgICAgayArPSBlY2NibGt3aWQ7XHJcbiAgICAgICAgfVxyXG4gICAgLy8gaW50ZXJsZWF2ZSBibG9ja3NcclxuICAgICAgICB5ID0gMDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YWJsa3c7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmVjY2JsazE7IGorKylcclxuICAgICAgICAgICAgICAgIGVjY2J1Zlt5KytdID0gc3RyaW5idWZbaSArIGogKiBkYXRhYmxrd107XHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuZWNjYmxrMjsgaisrKVxyXG4gICAgICAgICAgICAgICAgZWNjYnVmW3krK10gPSBzdHJpbmJ1ZlsobmVjY2JsazEgKiBkYXRhYmxrdykgKyBpICsgKGogKiAoZGF0YWJsa3cgKyAxKSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmVjY2JsazI7IGorKylcclxuICAgICAgICAgICAgZWNjYnVmW3krK10gPSBzdHJpbmJ1ZlsobmVjY2JsazEgKiBkYXRhYmxrdykgKyBpICsgKGogKiAoZGF0YWJsa3cgKyAxKSldO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBlY2NibGt3aWQ7IGkrKylcclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IG5lY2NibGsxICsgbmVjY2JsazI7IGorKylcclxuICAgICAgICAgICAgICAgIGVjY2J1Zlt5KytdID0gc3RyaW5idWZbeCArIGkgKyBqICogZWNjYmxrd2lkXTtcclxuICAgICAgICBzdHJpbmJ1ZiA9IGVjY2J1ZjtcclxuXHJcbiAgICAvLyBwYWNrIGJpdHMgaW50byBmcmFtZSBhdm9pZGluZyBtYXNrZWQgYXJlYS5cclxuICAgICAgICB4ID0geSA9IHdpZHRoIC0gMTtcclxuICAgICAgICBrID0gdiA9IDE7ICAgICAgICAgLy8gdXAsIG1pbnVzXHJcbiAgICAgICAgLyogaW50ZWxlYXZlZCBkYXRhIGFuZCBlY2MgY29kZXMgKi9cclxuICAgICAgICBtID0gKGRhdGFibGt3ICsgZWNjYmxrd2lkKSAqIChuZWNjYmxrMSArIG5lY2NibGsyKSArIG5lY2NibGsyO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBtOyBpKyspIHtcclxuICAgICAgICAgICAgdCA9IHN0cmluYnVmW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgODsgaisrLCB0IDw8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoMHg4MCAmIHQpXHJcbiAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgd2lkdGggKiB5XSA9IDE7XHJcbiAgICAgICAgICAgICAgICBkbyB7ICAgICAgICAvLyBmaW5kIG5leHQgZmlsbCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5ICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCAtPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSA2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9IDk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkgIT0gd2lkdGggLSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggLT0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrID0gIWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLT0gODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9ICF2O1xyXG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoaXNtYXNrZWQoeCwgeSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIHNhdmUgcHJlLW1hc2sgY29weSBvZiBmcmFtZVxyXG4gICAgICAgIHN0cmluYnVmID0gcXJmcmFtZS5zbGljZSgwKTtcclxuICAgICAgICB0ID0gMDsgICAgICAgICAgIC8vIGJlc3RcclxuICAgICAgICB5ID0gMzAwMDA7ICAgICAgICAgLy8gZGVtZXJpdFxyXG4gICAgLy8gZm9yIGluc3RlYWQgb2Ygd2hpbGUgc2luY2UgaW4gb3JpZ2luYWwgYXJkdWlubyBjb2RlXHJcbiAgICAvLyBpZiBhbiBlYXJseSBtYXNrIHdhcyBcImdvb2QgZW5vdWdoXCIgaXQgd291bGRuJ3QgdHJ5IGZvciBhIGJldHRlciBvbmVcclxuICAgIC8vIHNpbmNlIHRoZXkgZ2V0IG1vcmUgY29tcGxleCBhbmQgdGFrZSBsb25nZXIuXHJcbiAgICAgICAgZm9yIChrID0gMDsgayA8IDg7IGsrKykge1xyXG4gICAgICAgICAgICBhcHBseW1hc2soayk7ICAgICAgLy8gcmV0dXJucyBibGFjay13aGl0ZSBpbWJhbGFuY2VcclxuICAgICAgICAgICAgeCA9IGJhZGNoZWNrKCk7XHJcbiAgICAgICAgICAgIGlmICh4IDwgeSkgeyAvLyBjdXJyZW50IG1hc2sgYmV0dGVyIHRoYW4gcHJldmlvdXMgYmVzdD9cclxuICAgICAgICAgICAgICAgIHkgPSB4O1xyXG4gICAgICAgICAgICAgICAgdCA9IGs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHQgPT0gNylcclxuICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgICAvLyBkb24ndCBpbmNyZW1lbnQgaSB0byBhIHZvaWQgcmVkb2luZyBtYXNrXHJcbiAgICAgICAgICAgIHFyZnJhbWUgPSBzdHJpbmJ1Zi5zbGljZSgwKTsgLy8gcmVzZXQgZm9yIG5leHQgcGFzc1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodCAhPSBrKSAgICAgICAgIC8vIHJlZG8gYmVzdCBtYXNrIC0gbm9uZSBnb29kIGVub3VnaCwgbGFzdCB3YXNuJ3QgdFxyXG4gICAgICAgICAgICBhcHBseW1hc2sodCk7XHJcblxyXG4gICAgLy8gYWRkIGluIGZpbmFsIG1hc2svZWNjbGV2ZWwgYnl0ZXNcclxuICAgICAgICB5ID0gZm10d29yZFt0ICsgKChlY2NsZXZlbCAtIDEpIDw8IDMpXTtcclxuICAgICAgICAvLyBsb3cgYnl0ZVxyXG4gICAgICAgIGZvciAoayA9IDA7IGsgPCA4OyBrKyssIHkgPj49IDEpXHJcbiAgICAgICAgICAgIGlmICh5ICYgMSkge1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsod2lkdGggLSAxIC0gaykgKyB3aWR0aCAqIDhdID0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChrIDwgNilcclxuICAgICAgICAgICAgICAgICAgICBxcmZyYW1lWzggKyB3aWR0aCAqIGtdID0gMTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBxcmZyYW1lWzggKyB3aWR0aCAqIChrICsgMSldID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vIGhpZ2ggYnl0ZVxyXG4gICAgICAgIGZvciAoayA9IDA7IGsgPCA3OyBrKyssIHkgPj49IDEpXHJcbiAgICAgICAgICAgIGlmICh5ICYgMSkge1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVs4ICsgd2lkdGggKiAod2lkdGggLSA3ICsgayldID0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChrKVxyXG4gICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbKDYgLSBrKSArIHdpZHRoICogOF0gPSAxO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbNyArIHdpZHRoICogOF0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgLy8gcmV0dXJuIGltYWdlXHJcbiAgICAgICAgcmV0dXJuIHFyZnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF9jYW52YXMgPSBudWxsLFxyXG4gICAgICAgIF9zaXplID0gbnVsbDtcclxuXHJcbiAgICB2YXIgYXBpID0ge1xyXG5cclxuICAgICAgICBnZXQgZWNjbGV2ZWwgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWNjbGV2ZWw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0IGVjY2xldmVsICh2YWwpIHtcclxuICAgICAgICAgICAgZWNjbGV2ZWwgPSB2YWw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0IHNpemUgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3NpemU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0IHNpemUgKHZhbCkge1xyXG4gICAgICAgICAgICBfc2l6ZSA9IHZhbFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldCBjYW52YXMgKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2NhbnZhcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZXQgY2FudmFzIChlbCkge1xyXG4gICAgICAgICAgICBfY2FudmFzID0gZWw7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0RnJhbWU6IGZ1bmN0aW9uIChzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdlbmZyYW1lKHN0cmluZyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZHJhdzogZnVuY3Rpb24gKHN0cmluZywgY2FudmFzLCBzaXplLCBlY2MpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVjY2xldmVsID0gZWNjIHx8IGVjY2xldmVsO1xyXG4gICAgICAgICAgICBjYW52YXMgPSBjYW52YXMgfHwgX2NhbnZhcztcclxuXHJcbiAgICAgICAgICAgIGlmICghY2FudmFzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIGNhbnZhcyBwcm92aWRlZCB0byBkcmF3IFFSIGNvZGUgaW4hJylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2l6ZSA9IHNpemUgfHwgX3NpemUgfHwgTWF0aC5taW4oY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9IGdlbmZyYW1lKHN0cmluZyksXHJcbiAgICAgICAgICAgICAgICBjdHggPSBjYW52YXMuY3R4LFxyXG4gICAgICAgICAgICAgICAgcHggPSBNYXRoLnJvdW5kKHNpemUgLyAod2lkdGggKyA4KSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcm91bmRlZFNpemUgPSBweCAqICh3aWR0aCArIDgpLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5mbG9vcigoc2l6ZSAtIHJvdW5kZWRTaXplKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgc2l6ZSA9IHJvdW5kZWRTaXplO1xyXG5cclxuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2V0RmlsbFN0eWxlKCcjMDAwMDAwJyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFtZVtqICogd2lkdGggKyBpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QocHggKiAoNCArIGkpICsgb2Zmc2V0LCBweCAqICg0ICsgaikgKyBvZmZzZXQsIHB4LCBweCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5kcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgIGFwaTogYXBpXHJcbiAgICB9XHJcblxyXG59KSgpOyJdfQ==