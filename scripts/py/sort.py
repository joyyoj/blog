
if __name__ == "__main__":
    filename = "/Users/sunshangchun/data/diff/0AyUH7Vg"

    prev=""
    sum=0
    with open(filename, "r") as lines:
        for line in lines:
            m=filter(None, line.strip().split(" "))

        # s=0
        #     m=filter(None, line.rstrip("\n").split(" "))
        #     if m[1] != prev:
        #         print "%s %s" % (prev, s)
        #         s=int(m[2])
        #     else:
        #         s+=int(m[2])
        #     sum+=int(m[2])
        #     prev = m[1]
    print sum

