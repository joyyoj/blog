function day_range() {
    dstart=$1
    dend=$2
    # convert in seconds sinch the epoch:
    start=$(date -d$dstart +%s)
    end=$(date -d$dend +%s)
    cur=$start
    output=()
    while [ $cur -lt $end ]; do
        # convert seconds to date:
        date -d@$cur +%Y-%m-%d
        let cur+=24*60*60
        output+=($cur)
    done
    return $output
}