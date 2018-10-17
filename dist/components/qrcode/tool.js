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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2wuanMiXSwibmFtZXMiOlsiUVIiLCJhZGVsdGEiLCJ2cGF0IiwiZm10d29yZCIsImVjY2Jsb2NrcyIsImdsb2ciLCJnZXhwIiwic3RyaW5idWYiLCJlY2NidWYiLCJxcmZyYW1lIiwiZnJhbWFzayIsInJsZW5zIiwidmVyc2lvbiIsIndpZHRoIiwibmVjY2JsazEiLCJuZWNjYmxrMiIsImRhdGFibGt3IiwiZWNjYmxrd2lkIiwiZWNjbGV2ZWwiLCJzZXRtYXNrIiwieCIsInkiLCJidCIsInB1dGFsaWduIiwiaiIsIm1vZG5uIiwiZ2VucG9seSIsImFwcGVuZHJzIiwiZGF0YSIsImRsZW4iLCJlY2J1ZiIsImVjbGVuIiwiaSIsImZiIiwiaXNtYXNrZWQiLCJhcHBseW1hc2siLCJtIiwicjN4IiwicjN5IiwiTjEiLCJOMiIsIk4zIiwiTjQiLCJiYWRydW5zIiwibGVuZ3RoIiwicnVuc2JhZCIsImJhZGNoZWNrIiwiaCIsImIiLCJiMSIsInRoaXNiYWQiLCJidyIsImJpZyIsImNvdW50IiwiZ2VuZnJhbWUiLCJpbnN0cmluZyIsImsiLCJ0IiwidiIsInNsaWNlIiwiY2hhckNvZGVBdCIsIl9jYW52YXMiLCJfc2l6ZSIsImFwaSIsInZhbCIsInNpemUiLCJjYW52YXMiLCJlbCIsImdldEZyYW1lIiwic3RyaW5nIiwiZHJhdyIsImVjYyIsImNvbnNvbGUiLCJ3YXJuIiwiTWF0aCIsIm1pbiIsImhlaWdodCIsImZyYW1lIiwiY3R4IiwicHgiLCJyb3VuZCIsInJvdW5kZWRTaXplIiwib2Zmc2V0IiwiZmxvb3IiLCJjbGVhclJlY3QiLCJzZXRGaWxsU3R5bGUiLCJmaWxsUmVjdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsS0FBTSxZQUFZOztBQUVsQjtBQUNBLFFBQUlDLFNBQVMsQ0FDWCxDQURXLEVBQ1IsRUFEUSxFQUNKLEVBREksRUFDQSxFQURBLEVBQ0ksRUFESixFQUNRLEVBRFIsRUFDWSxFQURaLEVBQ2dCO0FB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RlQ7O0FBSUEsZ0JBQUlvRSxjQUFjRixNQUFNbEUsUUFBUSxDQUFkLENBQWxCO0FBQUEsZ0JBQ0lxRSxTQUFTUixLQUFLUyxLQUFMLENBQVcsQ0FBQ2xCLE9BQU9nQixXQUFSLElBQXVCLENBQWxDLENBRGI7O0FBR0FoQixtQkFBT2dCLFdBQVA7O0FBRUFILGdCQUFJTSxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQmxCLE9BQU9yRCxLQUEzQixFQUFrQ3FELE9BQU9VLE1BQXpDO0FBQ0FFLGdCQUFJTyxZQUFKLENBQWlCLFNBQWpCOztBQUVBLGlCQUFLLElBQUlyRCxJQUFJLENBQWIsRUFBZ0JBLElBQUluQixLQUFwQixFQUEyQm1CLEdBQTNCLEVBQWdDO0FBQzVCLHFCQUFLLElBQUlSLElBQUksQ0FBYixFQUFnQkEsSUFBSVgsS0FBcEIsRUFBMkJXLEdBQTNCLEVBQWdDO0FBQzVCLHdCQUFJcUQsTUFBTXJELElBQUlYLEtBQUosR0FBWW1CLENBQWxCLENBQUosRUFBMEI7QUFDdEI4Qyw0QkFBSVEsUUFBSixDQUFhUCxNQUFNLElBQUkvQyxDQUFWLElBQWVrRCxNQUE1QixFQUFvQ0gsTUFBTSxJQUFJdkQsQ0FBVixJQUFlMEQsTUFBbkQsRUFBMkRILEVBQTNELEVBQStEQSxFQUEvRDtBQUNIO0FBQ0o7QUFDSjtBQUNERCxnQkFBSVIsSUFBSjtBQUNIO0FBOURLLEtBQVY7O0FBaUVBaUIsV0FBT0MsT0FBUCxHQUFpQjtBQUNiekIsYUFBS0E7QUFEUSxLQUFqQjtBQUlILENBendCUSxFQUFUIiwiZmlsZSI6InRvb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUVIgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIGFsaWdubWVudCBwYXR0ZXJuXHJcbiAgICB2YXIgYWRlbHRhID0gW1xyXG4gICAgICAwLCAxMSwgMTUsIDE5LCAyMywgMjcsIDMxLCAvLyBmb3JjZSAxIHBhdFxyXG4gICAgICAxNiwgMTgsIDIwLCAyMiwgMjQsIDI2LCAyOCwgMjAsIDIyLCAyNCwgMjQsIDI2LCAyOCwgMjgsIDIyLCAyNCwgMjQsXHJcbiAgICAgIDI2LCAyNiwgMjgsIDI4LCAyNCwgMjQsIDI2LCAyNiwgMjYsIDI4LCAyOCwgMjQsIDI2LCAyNiwgMjYsIDI4LCAyOFxyXG4gICAgICBdO1xyXG5cclxuICAgIC8vIHZlcnNpb24gYmxvY2tcclxuICAgIHZhciB2cGF0ID0gW1xyXG4gICAgICAgIDB4Yzk0LCAweDViYywgMHhhOTksIDB4NGQzLCAweGJmNiwgMHg3NjIsIDB4ODQ3LCAweDYwZCxcclxuICAgICAgICAweDkyOCwgMHhiNzgsIDB4NDVkLCAweGExNywgMHg1MzIsIDB4OWE2LCAweDY4MywgMHg4YzksXHJcbiAgICAgICAgMHg3ZWMsIDB4ZWM0LCAweDFlMSwgMHhmYWIsIDB4MDhlLCAweGMxYSwgMHgzM2YsIDB4ZDc1LFxyXG4gICAgICAgIDB4MjUwLCAweDlkNSwgMHg2ZjAsIDB4OGJhLCAweDc5ZiwgMHhiMGIsIDB4NDJlLCAweGE2NCxcclxuICAgICAgICAweDU0MSwgMHhjNjlcclxuICAgIF07XHJcblxyXG4gICAgLy8gZmluYWwgZm9ybWF0IGJpdHMgd2l0aCBtYXNrOiBsZXZlbCA8PCAzIHwgbWFza1xyXG4gICAgdmFyIGZtdHdvcmQgPSBbXHJcbiAgICAgICAgMHg3N2M0LCAweDcyZjMsIDB4N2RhYSwgMHg3ODlkLCAweDY2MmYsIDB4NjMxOCwgMHg2YzQxLCAweDY5NzYsICAgIC8vTFxyXG4gICAgICAgIDB4NTQxMiwgMHg1MTI1LCAweDVlN2MsIDB4NWI0YiwgMHg0NWY5LCAweDQwY2UsIDB4NGY5NywgMHg0YWEwLCAgICAvL01cclxuICAgICAgICAweDM1NWYsIDB4MzA2OCwgMHgzZjMxLCAweDNhMDYsIDB4MjRiNCwgMHgyMTgzLCAweDJlZGEsIDB4MmJlZCwgICAgLy9RXHJcbiAgICAgICAgMHgxNjg5LCAweDEzYmUsIDB4MWNlNywgMHgxOWQwLCAweDA3NjIsIDB4MDI1NSwgMHgwZDBjLCAweDA4M2IgICAgLy9IXHJcbiAgICBdO1xyXG5cclxuICAgIC8vIDQgcGVyIHZlcnNpb246IG51bWJlciBvZiBibG9ja3MgMSwyOyBkYXRhIHdpZHRoOyBlY2Mgd2lkdGhcclxuICAgIHZhciBlY2NibG9ja3MgPSBbXHJcbiAgICAgICAgMSwgMCwgMTksIDcsIDEsIDAsIDE2LCAxMCwgMSwgMCwgMTMsIDEzLCAxLCAwLCA5LCAxNyxcclxuICAgICAgICAxLCAwLCAzNCwgMTAsIDEsIDAsIDI4LCAxNiwgMSwgMCwgMjIsIDIyLCAxLCAwLCAxNiwgMjgsXHJcbiAgICAgICAgMSwgMCwgNTUsIDE1LCAxLCAwLCA0NCwgMjYsIDIsIDAsIDE3LCAxOCwgMiwgMCwgMTMsIDIyLFxyXG4gICAgICAgIDEsIDAsIDgwLCAyMCwgMiwgMCwgMzIsIDE4LCAyLCAwLCAyNCwgMjYsIDQsIDAsIDksIDE2LFxyXG4gICAgICAgIDEsIDAsIDEwOCwgMjYsIDIsIDAsIDQzLCAyNCwgMiwgMiwgMTUsIDE4LCAyLCAyLCAxMSwgMjIsXHJcbiAgICAgICAgMiwgMCwgNjgsIDE4LCA0LCAwLCAyNywgMTYsIDQsIDAsIDE5LCAyNCwgNCwgMCwgMTUsIDI4LFxyXG4gICAgICAgIDIsIDAsIDc4LCAyMCwgNCwgMCwgMzEsIDE4LCAyLCA0LCAxNCwgMTgsIDQsIDEsIDEzLCAyNixcclxuICAgICAgICAyLCAwLCA5NywgMjQsIDIsIDIsIDM4LCAyMiwgNCwgMiwgMTgsIDIyLCA0LCAyLCAxNCwgMjYsXHJcbiAgICAgICAgMiwgMCwgMTE2LCAzMCwgMywgMiwgMzYsIDIyLCA0LCA0LCAxNiwgMjAsIDQsIDQsIDEyLCAyNCxcclxuICAgICAgICAyLCAyLCA2OCwgMTgsIDQsIDEsIDQzLCAyNiwgNiwgMiwgMTksIDI0LCA2LCAyLCAxNSwgMjgsXHJcbiAgICAgICAgNCwgMCwgODEsIDIwLCAxLCA0LCA1MCwgMzAsIDQsIDQsIDIyLCAyOCwgMywgOCwgMTIsIDI0LFxyXG4gICAgICAgIDIsIDIsIDkyLCAyNCwgNiwgMiwgMzYsIDIyLCA0LCA2LCAyMCwgMjYsIDcsIDQsIDE0LCAyOCxcclxuICAgICAgICA0LCAwLCAxMDcsIDI2LCA4LCAxLCAzNywgMjIsIDgsIDQsIDIwLCAyNCwgMTIsIDQsIDExLCAyMixcclxuICAgICAgICAzLCAxLCAxMTUsIDMwLCA0LCA1LCA0MCwgMjQsIDExLCA1LCAxNiwgMjAsIDExLCA1LCAxMiwgMjQsXHJcbiAgICAgICAgNSwgMSwgODcsIDIyLCA1LCA1LCA0MSwgMjQsIDUsIDcsIDI0LCAzMCwgMTEsIDcsIDEyLCAyNCxcclxuICAgICAgICA1LCAxLCA5OCwgMjQsIDcsIDMsIDQ1LCAyOCwgMTUsIDIsIDE5LCAyNCwgMywgMTMsIDE1LCAzMCxcclxuICAgICAgICAxLCA1LCAxMDcsIDI4LCAxMCwgMSwgNDYsIDI4LCAxLCAxNSwgMjIsIDI4LCAyLCAxNywgMTQsIDI4LFxyXG4gICAgICAgIDUsIDEsIDEyMCwgMzAsIDksIDQsIDQzLCAyNiwgMTcsIDEsIDIyLCAyOCwgMiwgMTksIDE0LCAyOCxcclxuICAgICAgICAzLCA0LCAxMTMsIDI4LCAzLCAxMSwgNDQsIDI2LCAxNywgNCwgMjEsIDI2LCA5LCAxNiwgMTMsIDI2LFxyXG4gICAgICAgIDMsIDUsIDEwNywgMjgsIDMsIDEzLCA0MSwgMjYsIDE1LCA1LCAyNCwgMzAsIDE1LCAxMCwgMTUsIDI4LFxyXG4gICAgICAgIDQsIDQsIDExNiwgMjgsIDE3LCAwLCA0MiwgMjYsIDE3LCA2LCAyMiwgMjgsIDE5LCA2LCAxNiwgMzAsXHJcbiAgICAgICAgMiwgNywgMTExLCAyOCwgMTcsIDAsIDQ2LCAyOCwgNywgMTYsIDI0LCAzMCwgMzQsIDAsIDEzLCAyNCxcclxuICAgICAgICA0LCA1LCAxMjEsIDMwLCA0LCAxNCwgNDcsIDI4LCAxMSwgMTQsIDI0LCAzMCwgMTYsIDE0LCAxNSwgMzAsXHJcbiAgICAgICAgNiwgNCwgMTE3LCAzMCwgNiwgMTQsIDQ1LCAyOCwgMTEsIDE2LCAyNCwgMzAsIDMwLCAyLCAxNiwgMzAsXHJcbiAgICAgICAgOCwgNCwgMTA2LCAyNiwgOCwgMTMsIDQ3LCAyOCwgNywgMjIsIDI0LCAzMCwgMjIsIDEzLCAxNSwgMzAsXHJcbiAgICAgICAgMTAsIDIsIDExNCwgMjgsIDE5LCA0LCA0NiwgMjgsIDI4LCA2LCAyMiwgMjgsIDMzLCA0LCAxNiwgMzAsXHJcbiAgICAgICAgOCwgNCwgMTIyLCAzMCwgMjIsIDMsIDQ1LCAyOCwgOCwgMjYsIDIzLCAzMCwgMTIsIDI4LCAxNSwgMzAsXHJcbiAgICAgICAgMywgMTAsIDExNywgMzAsIDMsIDIzLCA0NSwgMjgsIDQsIDMxLCAyNCwgMzAsIDExLCAzMSwgMTUsIDMwLFxyXG4gICAgICAgIDcsIDcsIDExNiwgMzAsIDIxLCA3LCA0NSwgMjgsIDEsIDM3LCAyMywgMzAsIDE5LCAyNiwgMTUsIDMwLFxyXG4gICAgICAgIDUsIDEwLCAxMTUsIDMwLCAxOSwgMTAsIDQ3LCAyOCwgMTUsIDI1LCAyNCwgMzAsIDIzLCAyNSwgMTUsIDMwLFxyXG4gICAgICAgIDEzLCAzLCAxMTUsIDMwLCAyLCAyOSwgNDYsIDI4LCA0MiwgMSwgMjQsIDMwLCAyMywgMjgsIDE1LCAzMCxcclxuICAgICAgICAxNywgMCwgMTE1LCAzMCwgMTAsIDIzLCA0NiwgMjgsIDEwLCAzNSwgMjQsIDMwLCAxOSwgMzUsIDE1LCAzMCxcclxuICAgICAgICAxNywgMSwgMTE1LCAzMCwgMTQsIDIxLCA0NiwgMjgsIDI5LCAxOSwgMjQsIDMwLCAxMSwgNDYsIDE1LCAzMCxcclxuICAgICAgICAxMywgNiwgMTE1LCAzMCwgMTQsIDIzLCA0NiwgMjgsIDQ0LCA3LCAyNCwgMzAsIDU5LCAxLCAxNiwgMzAsXHJcbiAgICAgICAgMTIsIDcsIDEyMSwgMzAsIDEyLCAyNiwgNDcsIDI4LCAzOSwgMTQsIDI0LCAzMCwgMjIsIDQxLCAxNSwgMzAsXHJcbiAgICAgICAgNiwgMTQsIDEyMSwgMzAsIDYsIDM0LCA0NywgMjgsIDQ2LCAxMCwgMjQsIDMwLCAyLCA2NCwgMTUsIDMwLFxyXG4gICAgICAgIDE3LCA0LCAxMjIsIDMwLCAyOSwgMTQsIDQ2LCAyOCwgNDksIDEwLCAyNCwgMzAsIDI0LCA0NiwgMTUsIDMwLFxyXG4gICAgICAgIDQsIDE4LCAxMjIsIDMwLCAxMywgMzIsIDQ2LCAyOCwgNDgsIDE0LCAyNCwgMzAsIDQyLCAzMiwgMTUsIDMwLFxyXG4gICAgICAgIDIwLCA0LCAxMTcsIDMwLCA0MCwgNywgNDcsIDI4LCA0MywgMjIsIDI0LCAzMCwgMTAsIDY3LCAxNSwgMzAsXHJcbiAgICAgICAgMTksIDYsIDExOCwgMzAsIDE4LCAzMSwgNDcsIDI4LCAzNCwgMzQsIDI0LCAzMCwgMjAsIDYxLCAxNSwgMzBcclxuICAgIF07XHJcblxyXG4gICAgLy8gR2Fsb2lzIGZpZWxkIGxvZyB0YWJsZVxyXG4gICAgdmFyIGdsb2cgPSBbXHJcbiAgICAgICAgMHhmZiwgMHgwMCwgMHgwMSwgMHgxOSwgMHgwMiwgMHgzMiwgMHgxYSwgMHhjNiwgMHgwMywgMHhkZiwgMHgzMywgMHhlZSwgMHgxYiwgMHg2OCwgMHhjNywgMHg0YixcclxuICAgICAgICAweDA0LCAweDY0LCAweGUwLCAweDBlLCAweDM0LCAweDhkLCAweGVmLCAweDgxLCAweDFjLCAweGMxLCAweDY5LCAweGY4LCAweGM4LCAweDA4LCAweDRjLCAweDcxLFxyXG4gICAgICAgIDB4MDUsIDB4OGEsIDB4NjUsIDB4MmYsIDB4ZTEsIDB4MjQsIDB4MGYsIDB4MjEsIDB4MzUsIDB4OTMsIDB4OGUsIDB4ZGEsIDB4ZjAsIDB4MTIsIDB4ODIsIDB4NDUsXHJcbiAgICAgICAgMHgxZCwgMHhiNSwgMHhjMiwgMHg3ZCwgMHg2YSwgMHgyNywgMHhmOSwgMHhiOSwgMHhjOSwgMHg5YSwgMHgwOSwgMHg3OCwgMHg0ZCwgMHhlNCwgMHg3MiwgMHhhNixcclxuICAgICAgICAweDA2LCAweGJmLCAweDhiLCAweDYyLCAweDY2LCAweGRkLCAweDMwLCAweGZkLCAweGUyLCAweDk4LCAweDI1LCAweGIzLCAweDEwLCAweDkxLCAweDIyLCAweDg4LFxyXG4gICAgICAgIDB4MzYsIDB4ZDAsIDB4OTQsIDB4Y2UsIDB4OGYsIDB4OTYsIDB4ZGIsIDB4YmQsIDB4ZjEsIDB4ZDIsIDB4MTMsIDB4NWMsIDB4ODMsIDB4MzgsIDB4NDYsIDB4NDAsXHJcbiAgICAgICAgMHgxZSwgMHg0MiwgMHhiNiwgMHhhMywgMHhjMywgMHg0OCwgMHg3ZSwgMHg2ZSwgMHg2YiwgMHgzYSwgMHgyOCwgMHg1NCwgMHhmYSwgMHg4NSwgMHhiYSwgMHgzZCxcclxuICAgICAgICAweGNhLCAweDVlLCAweDliLCAweDlmLCAweDBhLCAweDE1LCAweDc5LCAweDJiLCAweDRlLCAweGQ0LCAweGU1LCAweGFjLCAweDczLCAweGYzLCAweGE3LCAweDU3LFxyXG4gICAgICAgIDB4MDcsIDB4NzAsIDB4YzAsIDB4ZjcsIDB4OGMsIDB4ODAsIDB4NjMsIDB4MGQsIDB4NjcsIDB4NGEsIDB4ZGUsIDB4ZWQsIDB4MzEsIDB4YzUsIDB4ZmUsIDB4MTgsXHJcbiAgICAgICAgMHhlMywgMHhhNSwgMHg5OSwgMHg3NywgMHgyNiwgMHhiOCwgMHhiNCwgMHg3YywgMHgxMSwgMHg0NCwgMHg5MiwgMHhkOSwgMHgyMywgMHgyMCwgMHg4OSwgMHgyZSxcclxuICAgICAgICAweDM3LCAweDNmLCAweGQxLCAweDViLCAweDk1LCAweGJjLCAweGNmLCAweGNkLCAweDkwLCAweDg3LCAweDk3LCAweGIyLCAweGRjLCAweGZjLCAweGJlLCAweDYxLFxyXG4gICAgICAgIDB4ZjIsIDB4NTYsIDB4ZDMsIDB4YWIsIDB4MTQsIDB4MmEsIDB4NWQsIDB4OWUsIDB4ODQsIDB4M2MsIDB4MzksIDB4NTMsIDB4NDcsIDB4NmQsIDB4NDEsIDB4YTIsXHJcbiAgICAgICAgMHgxZiwgMHgyZCwgMHg0MywgMHhkOCwgMHhiNywgMHg3YiwgMHhhNCwgMHg3NiwgMHhjNCwgMHgxNywgMHg0OSwgMHhlYywgMHg3ZiwgMHgwYywgMHg2ZiwgMHhmNixcclxuICAgICAgICAweDZjLCAweGExLCAweDNiLCAweDUyLCAweDI5LCAweDlkLCAweDU1LCAweGFhLCAweGZiLCAweDYwLCAweDg2LCAweGIxLCAweGJiLCAweGNjLCAweDNlLCAweDVhLFxyXG4gICAgICAgIDB4Y2IsIDB4NTksIDB4NWYsIDB4YjAsIDB4OWMsIDB4YTksIDB4YTAsIDB4NTEsIDB4MGIsIDB4ZjUsIDB4MTYsIDB4ZWIsIDB4N2EsIDB4NzUsIDB4MmMsIDB4ZDcsXHJcbiAgICAgICAgMHg0ZiwgMHhhZSwgMHhkNSwgMHhlOSwgMHhlNiwgMHhlNywgMHhhZCwgMHhlOCwgMHg3NCwgMHhkNiwgMHhmNCwgMHhlYSwgMHhhOCwgMHg1MCwgMHg1OCwgMHhhZlxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBHYWxpb3MgZmllbGQgZXhwb25lbnQgdGFibGVcclxuICAgIHZhciBnZXhwID0gW1xyXG4gICAgICAgIDB4MDEsIDB4MDIsIDB4MDQsIDB4MDgsIDB4MTAsIDB4MjAsIDB4NDAsIDB4ODAsIDB4MWQsIDB4M2EsIDB4NzQsIDB4ZTgsIDB4Y2QsIDB4ODcsIDB4MTMsIDB4MjYsXHJcbiAgICAgICAgMHg0YywgMHg5OCwgMHgyZCwgMHg1YSwgMHhiNCwgMHg3NSwgMHhlYSwgMHhjOSwgMHg4ZiwgMHgwMywgMHgwNiwgMHgwYywgMHgxOCwgMHgzMCwgMHg2MCwgMHhjMCxcclxuICAgICAgICAweDlkLCAweDI3LCAweDRlLCAweDljLCAweDI1LCAweDRhLCAweDk0LCAweDM1LCAweDZhLCAweGQ0LCAweGI1LCAweDc3LCAweGVlLCAweGMxLCAweDlmLCAweDIzLFxyXG4gICAgICAgIDB4NDYsIDB4OGMsIDB4MDUsIDB4MGEsIDB4MTQsIDB4MjgsIDB4NTAsIDB4YTAsIDB4NWQsIDB4YmEsIDB4NjksIDB4ZDIsIDB4YjksIDB4NmYsIDB4ZGUsIDB4YTEsXHJcbiAgICAgICAgMHg1ZiwgMHhiZSwgMHg2MSwgMHhjMiwgMHg5OSwgMHgyZiwgMHg1ZSwgMHhiYywgMHg2NSwgMHhjYSwgMHg4OSwgMHgwZiwgMHgxZSwgMHgzYywgMHg3OCwgMHhmMCxcclxuICAgICAgICAweGZkLCAweGU3LCAweGQzLCAweGJiLCAweDZiLCAweGQ2LCAweGIxLCAweDdmLCAweGZlLCAweGUxLCAweGRmLCAweGEzLCAweDViLCAweGI2LCAweDcxLCAweGUyLFxyXG4gICAgICAgIDB4ZDksIDB4YWYsIDB4NDMsIDB4ODYsIDB4MTEsIDB4MjIsIDB4NDQsIDB4ODgsIDB4MGQsIDB4MWEsIDB4MzQsIDB4NjgsIDB4ZDAsIDB4YmQsIDB4NjcsIDB4Y2UsXHJcbiAgICAgICAgMHg4MSwgMHgxZiwgMHgzZSwgMHg3YywgMHhmOCwgMHhlZCwgMHhjNywgMHg5MywgMHgzYiwgMHg3NiwgMHhlYywgMHhjNSwgMHg5NywgMHgzMywgMHg2NiwgMHhjYyxcclxuICAgICAgICAweDg1LCAweDE3LCAweDJlLCAweDVjLCAweGI4LCAweDZkLCAweGRhLCAweGE5LCAweDRmLCAweDllLCAweDIxLCAweDQyLCAweDg0LCAweDE1LCAweDJhLCAweDU0LFxyXG4gICAgICAgIDB4YTgsIDB4NGQsIDB4OWEsIDB4MjksIDB4NTIsIDB4YTQsIDB4NTUsIDB4YWEsIDB4NDksIDB4OTIsIDB4MzksIDB4NzIsIDB4ZTQsIDB4ZDUsIDB4YjcsIDB4NzMsXHJcbiAgICAgICAgMHhlNiwgMHhkMSwgMHhiZiwgMHg2MywgMHhjNiwgMHg5MSwgMHgzZiwgMHg3ZSwgMHhmYywgMHhlNSwgMHhkNywgMHhiMywgMHg3YiwgMHhmNiwgMHhmMSwgMHhmZixcclxuICAgICAgICAweGUzLCAweGRiLCAweGFiLCAweDRiLCAweDk2LCAweDMxLCAweDYyLCAweGM0LCAweDk1LCAweDM3LCAweDZlLCAweGRjLCAweGE1LCAweDU3LCAweGFlLCAweDQxLFxyXG4gICAgICAgIDB4ODIsIDB4MTksIDB4MzIsIDB4NjQsIDB4YzgsIDB4OGQsIDB4MDcsIDB4MGUsIDB4MWMsIDB4MzgsIDB4NzAsIDB4ZTAsIDB4ZGQsIDB4YTcsIDB4NTMsIDB4YTYsXHJcbiAgICAgICAgMHg1MSwgMHhhMiwgMHg1OSwgMHhiMiwgMHg3OSwgMHhmMiwgMHhmOSwgMHhlZiwgMHhjMywgMHg5YiwgMHgyYiwgMHg1NiwgMHhhYywgMHg0NSwgMHg4YSwgMHgwOSxcclxuICAgICAgICAweDEyLCAweDI0LCAweDQ4LCAweDkwLCAweDNkLCAweDdhLCAweGY0LCAweGY1LCAweGY3LCAweGYzLCAweGZiLCAweGViLCAweGNiLCAweDhiLCAweDBiLCAweDE2LFxyXG4gICAgICAgIDB4MmMsIDB4NTgsIDB4YjAsIDB4N2QsIDB4ZmEsIDB4ZTksIDB4Y2YsIDB4ODMsIDB4MWIsIDB4MzYsIDB4NmMsIDB4ZDgsIDB4YWQsIDB4NDcsIDB4OGUsIDB4MDBcclxuICAgIF07XHJcblxyXG4gICAgLy8gV29ya2luZyBidWZmZXJzOlxyXG4gICAgLy8gZGF0YSBpbnB1dCBhbmQgZWNjIGFwcGVuZCwgaW1hZ2Ugd29ya2luZyBidWZmZXIsIGZpeGVkIHBhcnQgb2YgaW1hZ2UsIHJ1biBsZW5ndGhzIGZvciBiYWRuZXNzXHJcbiAgICB2YXIgc3RyaW5idWY9W10sIGVjY2J1Zj1bXSwgcXJmcmFtZT1bXSwgZnJhbWFzaz1bXSwgcmxlbnM9W107IFxyXG4gICAgLy8gQ29udHJvbCB2YWx1ZXMgLSB3aWR0aCBpcyBiYXNlZCBvbiB2ZXJzaW9uLCBsYXN0IDQgYXJlIGZyb20gdGFibGUuXHJcbiAgICB2YXIgdmVyc2lvbiwgd2lkdGgsIG5lY2NibGsxLCBuZWNjYmxrMiwgZGF0YWJsa3csIGVjY2Jsa3dpZDtcclxuICAgIHZhciBlY2NsZXZlbCA9IDI7XHJcbiAgICAvLyBzZXQgYml0IHRvIGluZGljYXRlIGNlbGwgaW4gcXJmcmFtZSBpcyBpbW11dGFibGUuICBzeW1tZXRyaWMgYXJvdW5kIGRpYWdvbmFsXHJcbiAgICBmdW5jdGlvbiBzZXRtYXNrKHgsIHkpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGJ0O1xyXG4gICAgICAgIGlmICh4ID4geSkge1xyXG4gICAgICAgICAgICBidCA9IHg7XHJcbiAgICAgICAgICAgIHggPSB5O1xyXG4gICAgICAgICAgICB5ID0gYnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHkqeSA9IDErMys1Li4uXHJcbiAgICAgICAgYnQgPSB5O1xyXG4gICAgICAgIGJ0ICo9IHk7XHJcbiAgICAgICAgYnQgKz0geTtcclxuICAgICAgICBidCA+Pj0gMTtcclxuICAgICAgICBidCArPSB4O1xyXG4gICAgICAgIGZyYW1hc2tbYnRdID0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbnRlciBhbGlnbm1lbnQgcGF0dGVybiAtIGJsYWNrIHRvIHFyZnJhbWUsIHdoaXRlIHRvIG1hc2sgKGxhdGVyIGJsYWNrIGZyYW1lIG1lcmdlZCB0byBtYXNrKVxyXG4gICAgZnVuY3Rpb24gcHV0YWxpZ24oeCwgeSlcclxuICAgIHtcclxuICAgICAgICB2YXIgajtcclxuXHJcbiAgICAgICAgcXJmcmFtZVt4ICsgd2lkdGggKiB5XSA9IDE7XHJcbiAgICAgICAgZm9yIChqID0gLTI7IGogPCAyOyBqKyspIHtcclxuICAgICAgICAgICAgcXJmcmFtZVsoeCArIGopICsgd2lkdGggKiAoeSAtIDIpXSA9IDE7XHJcbiAgICAgICAgICAgIHFyZnJhbWVbKHggLSAyKSArIHdpZHRoICogKHkgKyBqICsgMSldID0gMTtcclxuICAgICAgICAgICAgcXJmcmFtZVsoeCArIDIpICsgd2lkdGggKiAoeSArIGopXSA9IDE7XHJcbiAgICAgICAgICAgIHFyZnJhbWVbKHggKyBqICsgMSkgKyB3aWR0aCAqICh5ICsgMildID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IDI7IGorKykge1xyXG4gICAgICAgICAgICBzZXRtYXNrKHggLSAxLCB5ICsgaik7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCArIDEsIHkgLSBqKTtcclxuICAgICAgICAgICAgc2V0bWFzayh4IC0gaiwgeSAtIDEpO1xyXG4gICAgICAgICAgICBzZXRtYXNrKHggKyBqLCB5ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBSZWVkIFNvbG9tb24gZXJyb3IgY29ycmVjdGlvblxyXG4gICAgLy8gZXhwb25lbnRpYXRpb24gbW9kIE5cclxuICAgIGZ1bmN0aW9uIG1vZG5uKHgpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHggPj0gMjU1KSB7XHJcbiAgICAgICAgICAgIHggLT0gMjU1O1xyXG4gICAgICAgICAgICB4ID0gKHggPj4gOCkgKyAoeCAmIDI1NSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnZW5wb2x5ID0gW107XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGFuZCBhcHBlbmQgRUNDIGRhdGEgdG8gZGF0YSBibG9jay4gIEJsb2NrIGlzIGluIHN0cmluYnVmLCBpbmRleGVzIHRvIGJ1ZmZlcnMgZ2l2ZW4uXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRycyhkYXRhLCBkbGVuLCBlY2J1ZiwgZWNsZW4pXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGksIGosIGZiO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZWNsZW47IGkrKylcclxuICAgICAgICAgICAgc3RyaW5idWZbZWNidWYgKyBpXSA9IDA7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRsZW47IGkrKykge1xyXG4gICAgICAgICAgICBmYiA9IGdsb2dbc3RyaW5idWZbZGF0YSArIGldIF4gc3RyaW5idWZbZWNidWZdXTtcclxuICAgICAgICAgICAgaWYgKGZiICE9IDI1NSkgICAgIC8qIGZiIHRlcm0gaXMgbm9uLXplcm8gKi9cclxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDE7IGogPCBlY2xlbjsgaisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluYnVmW2VjYnVmICsgaiAtIDFdID0gc3RyaW5idWZbZWNidWYgKyBqXSBeIGdleHBbbW9kbm4oZmIgKyBnZW5wb2x5W2VjbGVuIC0gal0pXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZm9yKCBqID0gZWNidWYgOyBqIDwgZWNidWYgKyBlY2xlbjsgaisrIClcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmJ1ZltqXSA9IHN0cmluYnVmW2ogKyAxXTtcclxuICAgICAgICAgICAgc3RyaW5idWZbIGVjYnVmICsgZWNsZW4gLSAxXSA9IGZiID09IDI1NSA/IDAgOiBnZXhwW21vZG5uKGZiICsgZ2VucG9seVswXSldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRnJhbWUgZGF0YSBpbnNlcnQgZm9sbG93aW5nIHRoZSBwYXRoIHJ1bGVzXHJcblxyXG4gICAgLy8gY2hlY2sgbWFzayAtIHNpbmNlIHN5bW1ldHJpY2FsIHVzZSBoYWxmLlxyXG4gICAgZnVuY3Rpb24gaXNtYXNrZWQoeCwgeSlcclxuICAgIHtcclxuICAgICAgICB2YXIgYnQ7XHJcbiAgICAgICAgaWYgKHggPiB5KSB7XHJcbiAgICAgICAgICAgIGJ0ID0geDtcclxuICAgICAgICAgICAgeCA9IHk7XHJcbiAgICAgICAgICAgIHkgPSBidDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnQgPSB5O1xyXG4gICAgICAgIGJ0ICs9IHkgKiB5O1xyXG4gICAgICAgIGJ0ID4+PSAxO1xyXG4gICAgICAgIGJ0ICs9IHg7XHJcbiAgICAgICAgcmV0dXJuIGZyYW1hc2tbYnRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyAgQXBwbHkgdGhlIHNlbGVjdGVkIG1hc2sgb3V0IG9mIHRoZSA4LlxyXG4gICAgZnVuY3Rpb24gIGFwcGx5bWFzayhtKVxyXG4gICAge1xyXG4gICAgICAgIHZhciB4LCB5LCByM3gsIHIzeTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChtKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGg7IHkrKylcclxuICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCB3aWR0aDsgeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKCh4ICsgeSkgJiAxKSAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGg7IHkrKylcclxuICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCB3aWR0aDsgeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHkgJiAxKSAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGg7IHkrKylcclxuICAgICAgICAgICAgICAgIGZvciAocjN4ID0gMCwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXIzeCAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBmb3IgKHIzeSA9IDAsIHkgPSAwOyB5IDwgd2lkdGg7IHkrKywgcjN5KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChyM3kgPT0gMylcclxuICAgICAgICAgICAgICAgICAgICByM3kgPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChyM3ggPSByM3ksIHggPSAwOyB4IDwgd2lkdGg7IHgrKywgcjN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocjN4ID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIzeCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyM3ggJiYgIWlzbWFza2VkKHgsIHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxcmZyYW1lW3ggKyB5ICogd2lkdGhdIF49IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGg7IHkrKylcclxuICAgICAgICAgICAgICAgIGZvciAocjN4ID0gMCwgcjN5ID0gKCh5ID4+IDEpICYgMSksIHggPSAwOyB4IDwgd2lkdGg7IHgrKywgcjN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocjN4ID09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN5ID0gIXIzeTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyM3kgJiYgIWlzbWFza2VkKHgsIHkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxcmZyYW1lW3ggKyB5ICogd2lkdGhdIF49IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgZm9yIChyM3kgPSAwLCB5ID0gMDsgeSA8IHdpZHRoOyB5KyssIHIzeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocjN5ID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgcjN5ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAocjN4ID0gMCwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISgoeCAmIHkgJiAxKSArICEoIXIzeCB8ICFyM3kpKSAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgIGZvciAocjN5ID0gMCwgeSA9IDA7IHkgPCB3aWR0aDsgeSsrLCByM3krKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHIzeSA9PSAzKVxyXG4gICAgICAgICAgICAgICAgICAgIHIzeSA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHIzeCA9IDAsIHggPSAwOyB4IDwgd2lkdGg7IHgrKywgcjN4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocjN4ID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHIzeCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoKCh4ICYgeSAmIDEpICsgKHIzeCAmJiAocjN4ID09IHIzeSkpKSAmIDEpICYmICFpc21hc2tlZCh4LCB5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVt4ICsgeSAqIHdpZHRoXSBePSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgZm9yIChyM3kgPSAwLCB5ID0gMDsgeSA8IHdpZHRoOyB5KyssIHIzeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocjN5ID09IDMpXHJcbiAgICAgICAgICAgICAgICAgICAgcjN5ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAocjN4ID0gMCwgeCA9IDA7IHggPCB3aWR0aDsgeCsrLCByM3grKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyM3ggPT0gMylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcjN4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISgoKHIzeCAmJiAocjN4ID09IHIzeSkpICsgKCh4ICsgeSkgJiAxKSkgJiAxKSAmJiAhaXNtYXNrZWQoeCwgeSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHkgKiB3aWR0aF0gXj0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJhZG5lc3MgY29lZmZpY2llbnRzLlxyXG4gICAgdmFyIE4xID0gMywgTjIgPSAzLCBOMyA9IDQwLCBONCA9IDEwO1xyXG5cclxuICAgIC8vIFVzaW5nIHRoZSB0YWJsZSBvZiB0aGUgbGVuZ3RoIG9mIGVhY2ggcnVuLCBjYWxjdWxhdGUgdGhlIGFtb3VudCBvZiBiYWQgaW1hZ2UgXHJcbiAgICAvLyAtIGxvbmcgcnVucyBvciB0aG9zZSB0aGF0IGxvb2sgbGlrZSBmaW5kZXJzOyBjYWxsZWQgdHdpY2UsIG9uY2UgZWFjaCBmb3IgWCBhbmQgWVxyXG4gICAgZnVuY3Rpb24gYmFkcnVucyhsZW5ndGgpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIHJ1bnNiYWQgPSAwO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPD0gbGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmIChybGVuc1tpXSA+PSA1KVxyXG4gICAgICAgICAgICAgICAgcnVuc2JhZCArPSBOMSArIHJsZW5zW2ldIC0gNTtcclxuICAgICAgICAvLyBCd0JCQndCIGFzIGluIGZpbmRlclxyXG4gICAgICAgIGZvciAoaSA9IDM7IGkgPCBsZW5ndGggLSAxOyBpICs9IDIpXHJcbiAgICAgICAgICAgIGlmIChybGVuc1tpIC0gMl0gPT0gcmxlbnNbaSArIDJdXHJcbiAgICAgICAgICAgICAgICAmJiBybGVuc1tpICsgMl0gPT0gcmxlbnNbaSAtIDFdXHJcbiAgICAgICAgICAgICAgICAmJiBybGVuc1tpIC0gMV0gPT0gcmxlbnNbaSArIDFdXHJcbiAgICAgICAgICAgICAgICAmJiBybGVuc1tpIC0gMV0gKiAzID09IHJsZW5zW2ldXHJcbiAgICAgICAgICAgICAgICAvLyB3aGl0ZSBhcm91bmQgdGhlIGJsYWNrIHBhdHRlcm4/IE5vdCBwYXJ0IG9mIHNwZWNcclxuICAgICAgICAgICAgICAgICYmIChybGVuc1tpIC0gM10gPT0gMCAvLyBiZWdpbm5pbmdcclxuICAgICAgICAgICAgICAgICAgICB8fCBpICsgMyA+IGxlbmd0aCAgLy8gZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgcmxlbnNbaSAtIDNdICogMyA+PSBybGVuc1tpXSAqIDQgfHwgcmxlbnNbaSArIDNdICogMyA+PSBybGVuc1tpXSAqIDQpXHJcbiAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIHJ1bnNiYWQgKz0gTjM7XHJcbiAgICAgICAgcmV0dXJuIHJ1bnNiYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGhvdyBiYWQgdGhlIG1hc2tlZCBpbWFnZSBpcyAtIGJsb2NrcywgaW1iYWxhbmNlLCBydW5zLCBvciBmaW5kZXJzLlxyXG4gICAgZnVuY3Rpb24gYmFkY2hlY2soKVxyXG4gICAge1xyXG4gICAgICAgIHZhciB4LCB5LCBoLCBiLCBiMTtcclxuICAgICAgICB2YXIgdGhpc2JhZCA9IDA7XHJcbiAgICAgICAgdmFyIGJ3ID0gMDtcclxuXHJcbiAgICAgICAgLy8gYmxvY2tzIG9mIHNhbWUgY29sb3IuXHJcbiAgICAgICAgZm9yICh5ID0gMDsgeSA8IHdpZHRoIC0gMTsgeSsrKVxyXG4gICAgICAgICAgICBmb3IgKHggPSAwOyB4IDwgd2lkdGggLSAxOyB4KyspXHJcbiAgICAgICAgICAgICAgICBpZiAoKHFyZnJhbWVbeCArIHdpZHRoICogeV0gJiYgcXJmcmFtZVsoeCArIDEpICsgd2lkdGggKiB5XVxyXG4gICAgICAgICAgICAgICAgICAgICAmJiBxcmZyYW1lW3ggKyB3aWR0aCAqICh5ICsgMSldICYmIHFyZnJhbWVbKHggKyAxKSArIHdpZHRoICogKHkgKyAxKV0pIC8vIGFsbCBibGFja1xyXG4gICAgICAgICAgICAgICAgICAgIHx8ICEocXJmcmFtZVt4ICsgd2lkdGggKiB5XSB8fCBxcmZyYW1lWyh4ICsgMSkgKyB3aWR0aCAqIHldXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB8fCBxcmZyYW1lW3ggKyB3aWR0aCAqICh5ICsgMSldIHx8IHFyZnJhbWVbKHggKyAxKSArIHdpZHRoICogKHkgKyAxKV0pKSAvLyBhbGwgd2hpdGVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzYmFkICs9IE4yO1xyXG5cclxuICAgICAgICAvLyBYIHJ1bnNcclxuICAgICAgICBmb3IgKHkgPSAwOyB5IDwgd2lkdGg7IHkrKykge1xyXG4gICAgICAgICAgICBybGVuc1swXSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaCA9IGIgPSB4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgoYjEgPSBxcmZyYW1lW3ggKyB3aWR0aCAqIHldKSA9PSBiKVxyXG4gICAgICAgICAgICAgICAgICAgIHJsZW5zW2hdKys7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmxlbnNbKytoXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBiID0gYjE7XHJcbiAgICAgICAgICAgICAgICBidyArPSBiID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXNiYWQgKz0gYmFkcnVucyhoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGJsYWNrL3doaXRlIGltYmFsYW5jZVxyXG4gICAgICAgIGlmIChidyA8IDApXHJcbiAgICAgICAgICAgIGJ3ID0gLWJ3O1xyXG5cclxuICAgICAgICB2YXIgYmlnID0gYnc7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMDtcclxuICAgICAgICBiaWcgKz0gYmlnIDw8IDI7XHJcbiAgICAgICAgYmlnIDw8PSAxO1xyXG4gICAgICAgIHdoaWxlIChiaWcgPiB3aWR0aCAqIHdpZHRoKVxyXG4gICAgICAgICAgICBiaWcgLT0gd2lkdGggKiB3aWR0aCwgY291bnQrKztcclxuICAgICAgICB0aGlzYmFkICs9IGNvdW50ICogTjQ7XHJcblxyXG4gICAgICAgIC8vIFkgcnVuc1xyXG4gICAgICAgIGZvciAoeCA9IDA7IHggPCB3aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHJsZW5zWzBdID0gMDtcclxuICAgICAgICAgICAgZm9yIChoID0gYiA9IHkgPSAwOyB5IDwgd2lkdGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChiMSA9IHFyZnJhbWVbeCArIHdpZHRoICogeV0pID09IGIpXHJcbiAgICAgICAgICAgICAgICAgICAgcmxlbnNbaF0rKztcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBybGVuc1srK2hdID0gMTtcclxuICAgICAgICAgICAgICAgIGIgPSBiMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzYmFkICs9IGJhZHJ1bnMoaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzYmFkO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmZyYW1lKGluc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHZhciB4LCB5LCBrLCB0LCB2LCBpLCBqLCBtO1xyXG5cclxuICAgIC8vIGZpbmQgdGhlIHNtYWxsZXN0IHZlcnNpb24gdGhhdCBmaXRzIHRoZSBzdHJpbmdcclxuICAgICAgICB0ID0gaW5zdHJpbmcubGVuZ3RoO1xyXG4gICAgICAgIHZlcnNpb24gPSAwO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgdmVyc2lvbisrO1xyXG4gICAgICAgICAgICBrID0gKGVjY2xldmVsIC0gMSkgKiA0ICsgKHZlcnNpb24gLSAxKSAqIDE2O1xyXG4gICAgICAgICAgICBuZWNjYmxrMSA9IGVjY2Jsb2Nrc1trKytdO1xyXG4gICAgICAgICAgICBuZWNjYmxrMiA9IGVjY2Jsb2Nrc1trKytdO1xyXG4gICAgICAgICAgICBkYXRhYmxrdyA9IGVjY2Jsb2Nrc1trKytdO1xyXG4gICAgICAgICAgICBlY2NibGt3aWQgPSBlY2NibG9ja3Nba107XHJcbiAgICAgICAgICAgIGsgPSBkYXRhYmxrdyAqIChuZWNjYmxrMSArIG5lY2NibGsyKSArIG5lY2NibGsyIC0gMyArICh2ZXJzaW9uIDw9IDkpO1xyXG4gICAgICAgICAgICBpZiAodCA8PSBrKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSB3aGlsZSAodmVyc2lvbiA8IDQwKTtcclxuXHJcbiAgICAvLyBGSVhNRSAtIGluc3VyZSB0aGF0IGl0IGZpdHMgaW5zdGVkIG9mIGJlaW5nIHRydW5jYXRlZFxyXG4gICAgICAgIHdpZHRoID0gMTcgKyA0ICogdmVyc2lvbjtcclxuXHJcbiAgICAvLyBhbGxvY2F0ZSwgY2xlYXIgYW5kIHNldHVwIGRhdGEgc3RydWN0dXJlc1xyXG4gICAgICAgIHYgPSBkYXRhYmxrdyArIChkYXRhYmxrdyArIGVjY2Jsa3dpZCkgKiAobmVjY2JsazEgKyBuZWNjYmxrMikgKyBuZWNjYmxrMjtcclxuICAgICAgICBmb3IoIHQgPSAwOyB0IDwgdjsgdCsrIClcclxuICAgICAgICAgICAgZWNjYnVmW3RdID0gMDtcclxuICAgICAgICBzdHJpbmJ1ZiA9IGluc3RyaW5nLnNsaWNlKDApO1xyXG5cclxuICAgICAgICBmb3IoIHQgPSAwOyB0IDwgd2lkdGggKiB3aWR0aDsgdCsrIClcclxuICAgICAgICAgICAgcXJmcmFtZVt0XSA9IDA7XHJcblxyXG4gICAgICAgIGZvciggdCA9IDAgOyB0IDwgKHdpZHRoICogKHdpZHRoICsgMSkgKyAxKSAvIDI7IHQrKylcclxuICAgICAgICAgICAgZnJhbWFza1t0XSA9IDA7XHJcblxyXG4gICAgLy8gaW5zZXJ0IGZpbmRlcnMgLSBibGFjayB0byBmcmFtZSwgd2hpdGUgdG8gbWFza1xyXG4gICAgICAgIGZvciAodCA9IDA7IHQgPCAzOyB0KyspIHtcclxuICAgICAgICAgICAgayA9IDA7XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICBpZiAodCA9PSAxKVxyXG4gICAgICAgICAgICAgICAgayA9ICh3aWR0aCAtIDcpO1xyXG4gICAgICAgICAgICBpZiAodCA9PSAyKVxyXG4gICAgICAgICAgICAgICAgeSA9ICh3aWR0aCAtIDcpO1xyXG4gICAgICAgICAgICBxcmZyYW1lWyh5ICsgMykgKyB3aWR0aCAqIChrICsgMyldID0gMTtcclxuICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IDY7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsoeSArIHgpICsgd2lkdGggKiBrXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lW3kgKyB3aWR0aCAqIChrICsgeCArIDEpXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lWyh5ICsgNikgKyB3aWR0aCAqIChrICsgeCldID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHkgKyB4ICsgMSkgKyB3aWR0aCAqIChrICsgNildID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHggPSAxOyB4IDwgNTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKHkgKyB4LCBrICsgMSk7XHJcbiAgICAgICAgICAgICAgICBzZXRtYXNrKHkgKyAxLCBrICsgeCArIDEpO1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzayh5ICsgNSwgayArIHgpO1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzayh5ICsgeCArIDEsIGsgKyA1KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHggPSAyOyB4IDwgNDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lWyh5ICsgeCkgKyB3aWR0aCAqIChrICsgMildID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHkgKyAyKSArIHdpZHRoICogKGsgKyB4ICsgMSldID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHkgKyA0KSArIHdpZHRoICogKGsgKyB4KV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgcXJmcmFtZVsoeSArIHggKyAxKSArIHdpZHRoICogKGsgKyA0KV0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIGFsaWdubWVudCBibG9ja3NcclxuICAgICAgICBpZiAodmVyc2lvbiA+IDEpIHtcclxuICAgICAgICAgICAgdCA9IGFkZWx0YVt2ZXJzaW9uXTtcclxuICAgICAgICAgICAgeSA9IHdpZHRoIC0gNztcclxuICAgICAgICAgICAgZm9yICg7Oykge1xyXG4gICAgICAgICAgICAgICAgeCA9IHdpZHRoIC0gNztcclxuICAgICAgICAgICAgICAgIHdoaWxlICh4ID4gdCAtIDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBwdXRhbGlnbih4LCB5KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCA8IHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIHggLT0gdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh5IDw9IHQgKyA5KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgeSAtPSB0O1xyXG4gICAgICAgICAgICAgICAgcHV0YWxpZ24oNiwgeSk7XHJcbiAgICAgICAgICAgICAgICBwdXRhbGlnbih5LCA2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAvLyBzaW5nbGUgYmxhY2tcclxuICAgICAgICBxcmZyYW1lWzggKyB3aWR0aCAqICh3aWR0aCAtIDgpXSA9IDE7XHJcblxyXG4gICAgLy8gdGltaW5nIGdhcCAtIG1hc2sgb25seVxyXG4gICAgICAgIGZvciAoeSA9IDA7IHkgPCA3OyB5KyspIHtcclxuICAgICAgICAgICAgc2V0bWFzayg3LCB5KTtcclxuICAgICAgICAgICAgc2V0bWFzayh3aWR0aCAtIDgsIHkpO1xyXG4gICAgICAgICAgICBzZXRtYXNrKDcsIHkgKyB3aWR0aCAtIDcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHggPSAwOyB4IDwgODsgeCsrKSB7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCwgNyk7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCArIHdpZHRoIC0gOCwgNyk7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCwgd2lkdGggLSA4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gcmVzZXJ2ZSBtYXNrLWZvcm1hdCBhcmVhXHJcbiAgICAgICAgZm9yICh4ID0gMDsgeCA8IDk7IHgrKylcclxuICAgICAgICAgICAgc2V0bWFzayh4LCA4KTtcclxuICAgICAgICBmb3IgKHggPSAwOyB4IDwgODsgeCsrKSB7XHJcbiAgICAgICAgICAgIHNldG1hc2soeCArIHdpZHRoIC0gOCwgOCk7XHJcbiAgICAgICAgICAgIHNldG1hc2soOCwgeCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoeSA9IDA7IHkgPCA3OyB5KyspXHJcbiAgICAgICAgICAgIHNldG1hc2soOCwgeSArIHdpZHRoIC0gNyk7XHJcblxyXG4gICAgLy8gdGltaW5nIHJvdy9jb2xcclxuICAgICAgICBmb3IgKHggPSAwOyB4IDwgd2lkdGggLSAxNDsgeCsrKVxyXG4gICAgICAgICAgICBpZiAoeCAmIDEpIHtcclxuICAgICAgICAgICAgICAgIHNldG1hc2soOCArIHgsIDYpO1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzayg2LCA4ICsgeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxcmZyYW1lWyg4ICsgeCkgKyB3aWR0aCAqIDZdID0gMTtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbNiArIHdpZHRoICogKDggKyB4KV0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgLy8gdmVyc2lvbiBibG9ja1xyXG4gICAgICAgIGlmICh2ZXJzaW9uID4gNikge1xyXG4gICAgICAgICAgICB0ID0gdnBhdFt2ZXJzaW9uIC0gN107XHJcbiAgICAgICAgICAgIGsgPSAxNztcclxuICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IDY7IHgrKylcclxuICAgICAgICAgICAgICAgIGZvciAoeSA9IDA7IHkgPCAzOyB5KyssIGstLSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMSAmIChrID4gMTEgPyB2ZXJzaW9uID4+IChrIC0gMTIpIDogdCA+PiBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxcmZyYW1lWyg1IC0geCkgKyB3aWR0aCAqICgyIC0geSArIHdpZHRoIC0gMTEpXSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbKDIgLSB5ICsgd2lkdGggLSAxMSkgKyB3aWR0aCAqICg1IC0geCldID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0bWFzayg1IC0geCwgMiAtIHkgKyB3aWR0aCAtIDExKTtcclxuICAgICAgICAgICAgICAgIHNldG1hc2soMiAtIHkgKyB3aWR0aCAtIDExLCA1IC0geCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgLy8gc3luYyBtYXNrIGJpdHMgLSBvbmx5IHNldCBhYm92ZSBmb3Igd2hpdGUgc3BhY2VzLCBzbyBhZGQgaW4gYmxhY2sgYml0c1xyXG4gICAgICAgIGZvciAoeSA9IDA7IHkgPCB3aWR0aDsgeSsrKVxyXG4gICAgICAgICAgICBmb3IgKHggPSAwOyB4IDw9IHk7IHgrKylcclxuICAgICAgICAgICAgICAgIGlmIChxcmZyYW1lW3ggKyB3aWR0aCAqIHldKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldG1hc2soeCwgeSk7XHJcblxyXG4gICAgLy8gY29udmVydCBzdHJpbmcgdG8gYml0c3RyZWFtXHJcbiAgICAvLyA4IGJpdCBkYXRhIHRvIFFSLWNvZGVkIDggYml0IGRhdGEgKG51bWVyaWMgb3IgYWxwaGFudW0sIG9yIGthbmppIG5vdCBzdXBwb3J0ZWQpXHJcbiAgICAgICAgdiA9IHN0cmluYnVmLmxlbmd0aDtcclxuXHJcbiAgICAvLyBzdHJpbmcgdG8gYXJyYXlcclxuICAgICAgICBmb3IoIGkgPSAwIDsgaSA8IHY7IGkrKyApXHJcbiAgICAgICAgICAgIGVjY2J1ZltpXSA9IHN0cmluYnVmLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgc3RyaW5idWYgPSBlY2NidWYuc2xpY2UoMCk7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIG1heCBzdHJpbmcgbGVuZ3RoXHJcbiAgICAgICAgeCA9IGRhdGFibGt3ICogKG5lY2NibGsxICsgbmVjY2JsazIpICsgbmVjY2JsazI7XHJcbiAgICAgICAgaWYgKHYgPj0geCAtIDIpIHtcclxuICAgICAgICAgICAgdiA9IHggLSAyO1xyXG4gICAgICAgICAgICBpZiAodmVyc2lvbiA+IDkpXHJcbiAgICAgICAgICAgICAgICB2LS07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIHNoaWZ0IGFuZCByZXBhY2sgdG8gaW5zZXJ0IGxlbmd0aCBwcmVmaXhcclxuICAgICAgICBpID0gdjtcclxuICAgICAgICBpZiAodmVyc2lvbiA+IDkpIHtcclxuICAgICAgICAgICAgc3RyaW5idWZbaSArIDJdID0gMDtcclxuICAgICAgICAgICAgc3RyaW5idWZbaSArIDNdID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgdCA9IHN0cmluYnVmW2ldO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5idWZbaSArIDNdIHw9IDI1NSAmICh0IDw8IDQpO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5idWZbaSArIDJdID0gdCA+PiA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cmluYnVmWzJdIHw9IDI1NSAmICh2IDw8IDQpO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZlsxXSA9IHYgPj4gNDtcclxuICAgICAgICAgICAgc3RyaW5idWZbMF0gPSAweDQwIHwgKHYgPj4gMTIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RyaW5idWZbaSArIDFdID0gMDtcclxuICAgICAgICAgICAgc3RyaW5idWZbaSArIDJdID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICAgICAgdCA9IHN0cmluYnVmW2ldO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5idWZbaSArIDJdIHw9IDI1NSAmICh0IDw8IDQpO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5idWZbaSArIDFdID0gdCA+PiA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cmluYnVmWzFdIHw9IDI1NSAmICh2IDw8IDQpO1xyXG4gICAgICAgICAgICBzdHJpbmJ1ZlswXSA9IDB4NDAgfCAodiA+PiA0KTtcclxuICAgICAgICB9XHJcbiAgICAvLyBmaWxsIHRvIGVuZCB3aXRoIHBhZCBwYXR0ZXJuXHJcbiAgICAgICAgaSA9IHYgKyAzIC0gKHZlcnNpb24gPCAxMCk7XHJcbiAgICAgICAgd2hpbGUgKGkgPCB4KSB7XHJcbiAgICAgICAgICAgIHN0cmluYnVmW2krK10gPSAweGVjO1xyXG4gICAgICAgICAgICAvLyBidWZmZXIgaGFzIHJvb20gICAgaWYgKGkgPT0geCkgICAgICBicmVhaztcclxuICAgICAgICAgICAgc3RyaW5idWZbaSsrXSA9IDB4MTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8vIGNhbGN1bGF0ZSBhbmQgYXBwZW5kIEVDQ1xyXG5cclxuICAgIC8vIGNhbGN1bGF0ZSBnZW5lcmF0b3IgcG9seW5vbWlhbFxyXG4gICAgICAgIGdlbnBvbHlbMF0gPSAxO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBlY2NibGt3aWQ7IGkrKykge1xyXG4gICAgICAgICAgICBnZW5wb2x5W2kgKyAxXSA9IDE7XHJcbiAgICAgICAgICAgIGZvciAoaiA9IGk7IGogPiAwOyBqLS0pXHJcbiAgICAgICAgICAgICAgICBnZW5wb2x5W2pdID0gZ2VucG9seVtqXVxyXG4gICAgICAgICAgICAgICAgPyBnZW5wb2x5W2ogLSAxXSBeIGdleHBbbW9kbm4oZ2xvZ1tnZW5wb2x5W2pdXSArIGkpXSA6IGdlbnBvbHlbaiAtIDFdO1xyXG4gICAgICAgICAgICBnZW5wb2x5WzBdID0gZ2V4cFttb2RubihnbG9nW2dlbnBvbHlbMF1dICsgaSldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IGVjY2Jsa3dpZDsgaSsrKVxyXG4gICAgICAgICAgICBnZW5wb2x5W2ldID0gZ2xvZ1tnZW5wb2x5W2ldXTsgLy8gdXNlIGxvZ3MgZm9yIGdlbnBvbHlbXSB0byBzYXZlIGNhbGMgc3RlcFxyXG5cclxuICAgIC8vIGFwcGVuZCBlY2MgdG8gZGF0YSBidWZmZXJcclxuICAgICAgICBrID0geDtcclxuICAgICAgICB5ID0gMDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmVjY2JsazE7IGkrKykge1xyXG4gICAgICAgICAgICBhcHBlbmRycyh5LCBkYXRhYmxrdywgaywgZWNjYmxrd2lkKTtcclxuICAgICAgICAgICAgeSArPSBkYXRhYmxrdztcclxuICAgICAgICAgICAgayArPSBlY2NibGt3aWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBuZWNjYmxrMjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFwcGVuZHJzKHksIGRhdGFibGt3ICsgMSwgaywgZWNjYmxrd2lkKTtcclxuICAgICAgICAgICAgeSArPSBkYXRhYmxrdyArIDE7XHJcbiAgICAgICAgICAgIGsgKz0gZWNjYmxrd2lkO1xyXG4gICAgICAgIH1cclxuICAgIC8vIGludGVybGVhdmUgYmxvY2tzXHJcbiAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGFibGt3OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IG5lY2NibGsxOyBqKyspXHJcbiAgICAgICAgICAgICAgICBlY2NidWZbeSsrXSA9IHN0cmluYnVmW2kgKyBqICogZGF0YWJsa3ddO1xyXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbmVjY2JsazI7IGorKylcclxuICAgICAgICAgICAgICAgIGVjY2J1Zlt5KytdID0gc3RyaW5idWZbKG5lY2NibGsxICogZGF0YWJsa3cpICsgaSArIChqICogKGRhdGFibGt3ICsgMSkpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IG5lY2NibGsyOyBqKyspXHJcbiAgICAgICAgICAgIGVjY2J1Zlt5KytdID0gc3RyaW5idWZbKG5lY2NibGsxICogZGF0YWJsa3cpICsgaSArIChqICogKGRhdGFibGt3ICsgMSkpXTtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZWNjYmxrd2lkOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuZWNjYmxrMSArIG5lY2NibGsyOyBqKyspXHJcbiAgICAgICAgICAgICAgICBlY2NidWZbeSsrXSA9IHN0cmluYnVmW3ggKyBpICsgaiAqIGVjY2Jsa3dpZF07XHJcbiAgICAgICAgc3RyaW5idWYgPSBlY2NidWY7XHJcblxyXG4gICAgLy8gcGFjayBiaXRzIGludG8gZnJhbWUgYXZvaWRpbmcgbWFza2VkIGFyZWEuXHJcbiAgICAgICAgeCA9IHkgPSB3aWR0aCAtIDE7XHJcbiAgICAgICAgayA9IHYgPSAxOyAgICAgICAgIC8vIHVwLCBtaW51c1xyXG4gICAgICAgIC8qIGludGVsZWF2ZWQgZGF0YSBhbmQgZWNjIGNvZGVzICovXHJcbiAgICAgICAgbSA9IChkYXRhYmxrdyArIGVjY2Jsa3dpZCkgKiAobmVjY2JsazEgKyBuZWNjYmxrMikgKyBuZWNjYmxrMjtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHQgPSBzdHJpbmJ1ZltpXTtcclxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IDg7IGorKywgdCA8PD0gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKDB4ODAgJiB0KVxyXG4gICAgICAgICAgICAgICAgICAgIHFyZnJhbWVbeCArIHdpZHRoICogeV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgZG8geyAgICAgICAgLy8gZmluZCBuZXh0IGZpbGwgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICAgICBpZiAodilcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeSAhPSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggLT0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrID0gIWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gNikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSA5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5ICE9IHdpZHRoIC0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4IC09IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgayA9ICFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC09IDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHYgPSAhdjtcclxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGlzbWFza2VkKHgsIHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAvLyBzYXZlIHByZS1tYXNrIGNvcHkgb2YgZnJhbWVcclxuICAgICAgICBzdHJpbmJ1ZiA9IHFyZnJhbWUuc2xpY2UoMCk7XHJcbiAgICAgICAgdCA9IDA7ICAgICAgICAgICAvLyBiZXN0XHJcbiAgICAgICAgeSA9IDMwMDAwOyAgICAgICAgIC8vIGRlbWVyaXRcclxuICAgIC8vIGZvciBpbnN0ZWFkIG9mIHdoaWxlIHNpbmNlIGluIG9yaWdpbmFsIGFyZHVpbm8gY29kZVxyXG4gICAgLy8gaWYgYW4gZWFybHkgbWFzayB3YXMgXCJnb29kIGVub3VnaFwiIGl0IHdvdWxkbid0IHRyeSBmb3IgYSBiZXR0ZXIgb25lXHJcbiAgICAvLyBzaW5jZSB0aGV5IGdldCBtb3JlIGNvbXBsZXggYW5kIHRha2UgbG9uZ2VyLlxyXG4gICAgICAgIGZvciAoayA9IDA7IGsgPCA4OyBrKyspIHtcclxuICAgICAgICAgICAgYXBwbHltYXNrKGspOyAgICAgIC8vIHJldHVybnMgYmxhY2std2hpdGUgaW1iYWxhbmNlXHJcbiAgICAgICAgICAgIHggPSBiYWRjaGVjaygpO1xyXG4gICAgICAgICAgICBpZiAoeCA8IHkpIHsgLy8gY3VycmVudCBtYXNrIGJldHRlciB0aGFuIHByZXZpb3VzIGJlc3Q/XHJcbiAgICAgICAgICAgICAgICB5ID0geDtcclxuICAgICAgICAgICAgICAgIHQgPSBrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0ID09IDcpXHJcbiAgICAgICAgICAgICAgICBicmVhazsgICAgICAgLy8gZG9uJ3QgaW5jcmVtZW50IGkgdG8gYSB2b2lkIHJlZG9pbmcgbWFza1xyXG4gICAgICAgICAgICBxcmZyYW1lID0gc3RyaW5idWYuc2xpY2UoMCk7IC8vIHJlc2V0IGZvciBuZXh0IHBhc3NcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHQgIT0gaykgICAgICAgICAvLyByZWRvIGJlc3QgbWFzayAtIG5vbmUgZ29vZCBlbm91Z2gsIGxhc3Qgd2Fzbid0IHRcclxuICAgICAgICAgICAgYXBwbHltYXNrKHQpO1xyXG5cclxuICAgIC8vIGFkZCBpbiBmaW5hbCBtYXNrL2VjY2xldmVsIGJ5dGVzXHJcbiAgICAgICAgeSA9IGZtdHdvcmRbdCArICgoZWNjbGV2ZWwgLSAxKSA8PCAzKV07XHJcbiAgICAgICAgLy8gbG93IGJ5dGVcclxuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgODsgaysrLCB5ID4+PSAxKVxyXG4gICAgICAgICAgICBpZiAoeSAmIDEpIHtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbKHdpZHRoIC0gMSAtIGspICsgd2lkdGggKiA4XSA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoayA8IDYpXHJcbiAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVs4ICsgd2lkdGggKiBrXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcXJmcmFtZVs4ICsgd2lkdGggKiAoayArIDEpXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAvLyBoaWdoIGJ5dGVcclxuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgNzsgaysrLCB5ID4+PSAxKVxyXG4gICAgICAgICAgICBpZiAoeSAmIDEpIHtcclxuICAgICAgICAgICAgICAgIHFyZnJhbWVbOCArIHdpZHRoICogKHdpZHRoIC0gNyArIGspXSA9IDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoaylcclxuICAgICAgICAgICAgICAgICAgICBxcmZyYW1lWyg2IC0gaykgKyB3aWR0aCAqIDhdID0gMTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBxcmZyYW1lWzcgKyB3aWR0aCAqIDhdID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgIC8vIHJldHVybiBpbWFnZVxyXG4gICAgICAgIHJldHVybiBxcmZyYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBfY2FudmFzID0gbnVsbCxcclxuICAgICAgICBfc2l6ZSA9IG51bGw7XHJcblxyXG4gICAgdmFyIGFwaSA9IHtcclxuXHJcbiAgICAgICAgZ2V0IGVjY2xldmVsICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVjY2xldmVsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldCBlY2NsZXZlbCAodmFsKSB7XHJcbiAgICAgICAgICAgIGVjY2xldmVsID0gdmFsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldCBzaXplICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zaXplO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNldCBzaXplICh2YWwpIHtcclxuICAgICAgICAgICAgX3NpemUgPSB2YWxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXQgY2FudmFzICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jYW52YXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2V0IGNhbnZhcyAoZWwpIHtcclxuICAgICAgICAgICAgX2NhbnZhcyA9IGVsO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEZyYW1lOiBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZW5mcmFtZShzdHJpbmcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRyYXc6IGZ1bmN0aW9uIChzdHJpbmcsIGNhbnZhcywgc2l6ZSwgZWNjKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBlY2NsZXZlbCA9IGVjYyB8fCBlY2NsZXZlbDtcclxuICAgICAgICAgICAgY2FudmFzID0gY2FudmFzIHx8IF9jYW52YXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWNhbnZhcykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdObyBjYW52YXMgcHJvdmlkZWQgdG8gZHJhdyBRUiBjb2RlIGluIScpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNpemUgPSBzaXplIHx8IF9zaXplIHx8IE1hdGgubWluKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSBnZW5mcmFtZShzdHJpbmcpLFxyXG4gICAgICAgICAgICAgICAgY3R4ID0gY2FudmFzLmN0eCxcclxuICAgICAgICAgICAgICAgIHB4ID0gTWF0aC5yb3VuZChzaXplIC8gKHdpZHRoICsgOCkpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJvdW5kZWRTaXplID0gcHggKiAod2lkdGggKyA4KSxcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IE1hdGguZmxvb3IoKHNpemUgLSByb3VuZGVkU2l6ZSkgLyAyKTtcclxuXHJcbiAgICAgICAgICAgIHNpemUgPSByb3VuZGVkU2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LnNldEZpbGxTdHlsZSgnIzAwMDAwMCcpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZnJhbWVbaiAqIHdpZHRoICsgaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHB4ICogKDQgKyBpKSArIG9mZnNldCwgcHggKiAoNCArIGopICsgb2Zmc2V0LCBweCwgcHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICAgICBhcGk6IGFwaVxyXG4gICAgfVxyXG5cclxufSkoKTsiXX0=