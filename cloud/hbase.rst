########

::

    create 'neo_on_matrix', {NAME => 'cf',  COMPRESSION=>'SNAPPY'},  {NUMREGIONS => 30, SPLITALGO => 'HexStringSplit'}

问题:

    提供一个schema编辑、展现的平台,提供日志打印的sdk工具?
    提供neo的平台化方式实现;

    class HiveHistoryRule extends MonitorRule {
    date = "";
    // name , rule, check interval,
    def name() {
    }

    def dependencies() {
        return name : [from, to, step];
    }

    def avg(List[DataPoint]) {
        return xx;
    }

    def sum(List[DataPoint]) {
    }

    def reportError(List[DataPoint] points) {
        return
    }
    }
    class Metrics extends MetricsRule {

    }
    class SendMetrics extends Metrics {
        avg(points)
    }
    meta: Download


    monitor: MonitorLog;
    monitor