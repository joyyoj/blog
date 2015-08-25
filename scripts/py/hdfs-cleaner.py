
if __name__ == "__main__":
    cmd = "hadoop fs -ls %s | awk -F 'delta/' '{print $2}' | awk -F '/' '{print $1}'" % root
    (ret, msg) = exec_shell(cmd)