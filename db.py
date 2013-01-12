import MySQLdb
import MySQLdb.cursors
import logging
import utilities

class Db:

    verbose = False

    def __init__(self, hostname, port, username, password, dbname,
                 use_unicode=True):
        self.host = hostname
        self.port = port
        self.user = username
        self.password = password
        self.dbname = dbname
        self.use_unicode = use_unicode
        self.log = logging.getLogger()
        self._test_process_time = 0
        self.connect()

    def close(self):
        self.conn.close()

    def connect(self):
        self.conn = MySQLdb.connect(host=self.host, port=self.port,
                                    user=self.user, passwd=self.password,
                                    db=self.dbname,
                                    cursorclass=MySQLdb.cursors.DictCursor,
                                    use_unicode=self.use_unicode)

    def testConnAndRefreshIfNecessary(self):
        # refresh every 15 seconds
        try:
            now = utilities.now_millis()
            if (self._test_process_time + 15000) < now:
                row = self._selectRowWithoutCheck("select count(1)")
                self._test_process_time = now
        except:
            self.log.info("Refreshing connection to db")
            self.connect()

    def commit(self):
        self.conn.commit()

    def selectRow(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        return self._selectRowWithoutCheck(sql, params)

    def selectAll(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        cursor.close()
        return rows

    def selectCursor(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        return cursor

    def execute(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        rowsAffected = cursor.rowcount
        self.commit()
        cursor.close()
        return rowsAffected

    def insertAutoIncrementRow(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        newId = cursor.lastrowid
        self.commit()
        cursor.close()
        return newId

    def _selectRowWithoutCheck(self, sql, params=None):
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        row = cursor.fetchone()
        cursor.close()
        return row