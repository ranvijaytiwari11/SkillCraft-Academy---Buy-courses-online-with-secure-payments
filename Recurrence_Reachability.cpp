// ================================================
// ॐ Namah Parvati Pataye Har Har Mahadev
// Inspiration : न द्वेष्टि न काङ्क्षति - स शिवः।
// ================================================
// Author      : Ranvijay Tiwari
// Language    : C++
// Focus       : DSA & Competitive Programming
// Status      : Always Learning | Always Improving

#include <iostream>
using namespace std;

int main() {
    int T;
    cin >> T;

    while (T--) {
        long long N, M;
        cin >> N >> M;

        if (M <= N) {
            if (M == 1) {
                cout << "1 2" << endl;
            } else {
                cout << M - 1 << " " << M << endl;
            }
            continue;
        }

        bool found = false;

        for (int k = 2; k <= 31; k++) {
            long long P = (1LL << k) - 1;
            if (P > M) break;

            long long d_max = (M - 1) / P;
            long long d_min = 1;

            if (M > N) {
                d_min = (M - N + (P - 2)) / (P - 1);
            }

            if (d_min <= d_max && d_min >= 1) {
                long long x = M - d_min * P;
                long long y = x + d_min;

                if (x >= 1 && y <= N && x < y) {
                    cout << x << " " << y << endl;
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            cout << -1 << endl;
        }
    }

    return 0;
}