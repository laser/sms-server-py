import MySQLdb
import MySQLdb.cursors
import logging
import utilities
import urlparse

class Db:

    verbose = False

    def __init__(self, db_url, use_unicode=True):
        parsed = urlparse.urlparse(db_url)

        db_name = db_url.split("/")[-1].split("?")[0]

        self.host = parsed.hostname
        self.port = parsed.port if parsed.port else 3306
        self.user = parsed.username
        self.password = parsed.password
        self.dbname = db_name

        self.use_unicode = use_unicode
        self.log = logging.getLogger()
        self._test_process_time = 0
        self.connect()
        self.verbose = False

    def close(self):
        self.conn.close()

    def connect(self):
        self.conn = MySQLdb.connect(host=self.host, 
                                    port=self.port,
                                    user=self.user, 
                                    passwd=self.password,
                                    db=self.dbname,
                                    cursorclass=MySQLdb.cursors.DictCursor,
                                    use_unicode=self.use_unicode)
        self.conn.autocommit(True)

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
        cursor.close()
        return rowsAffected

    def insertAutoIncrementRow(self, sql, params=None):
        self.testConnAndRefreshIfNecessary()
        cursor = self.conn.cursor()
        if self.verbose:
            self.log.debug("%s - params: %s" % (sql, str(params)))
        cursor.execute(sql, params)
        newId = cursor.lastrowid
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
