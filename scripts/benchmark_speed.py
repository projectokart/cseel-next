import time
import urllib.request
import gzip

def test_page_speed(url, name):
    print(f"\n--- Testing Speed: {name} ({url}) ---")
    timings = []
    sizes = []

    for i in range(3):
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        )
        t0 = time.perf_counter()
        with urllib.request.urlopen(req, timeout=15) as res:
            t1 = time.perf_counter() # TTFB
            content = res.read()
            t2 = time.perf_counter() # Total download

            # Uncompress if gzip
            if res.headers.get('Content-Encoding') == 'gzip':
                raw_len = len(gzip.decompress(content))
            else:
                raw_len = len(content)

            transfer_size = len(content)
            ttfb_ms = (t1 - t0) * 1000
            total_ms = (t2 - t0) * 1000
            timings.append((ttfb_ms, total_ms))
            sizes.append((transfer_size, raw_len))

    avg_ttfb = sum(t[0] for t in timings) / len(timings)
    avg_total = sum(t[1] for t in timings) / len(timings)
    print(f"  Attempts: 3")
    print(f"  Average TTFB: {avg_ttfb:.1f} ms")
    print(f"  Average Total Response Time: {avg_total:.1f} ms")
    print(f"  Transferred Size: {sizes[-1][0] / 1024:.1f} KB (Uncompressed: {sizes[-1][1] / 1024:.1f} KB)")
    print(f"  Speed Rating: {'EXCELLENT (< 300ms)' if avg_total < 300 else 'GOOD (< 800ms)' if avg_total < 800 else 'NEEDS CACHING'}")

if __name__ == '__main__':
    test_page_speed('http://localhost:3000/edu-network/teachers', 'Job Directory Listing')
    test_page_speed('http://localhost:3000/edu-network/teachers/job/ind-8cfbf5788202b281', 'Single Job Detail (Everwin)')
    test_page_speed('http://localhost:3000/materials', 'Materials Catalog')
