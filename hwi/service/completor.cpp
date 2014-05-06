#include <algorithm>
#include <sstream>
#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <string>

typedef std::vector<std::string> StringList;

class MetaStore {
public:
    void ReadResults(const std::string& file_name, std::vector<StringList>* results) {
        std::ifstream file(file_name.c_str());
        std::string line;
        while (file >> line) {
            std::stringstream ss(line);
            StringList row;
            std::string word;
            while (ss >> word) {
                row.push_back(word);
            }
            results->push_back(row);
        }
    }

    void GetDatabaseNames(StringList* db_names) {
        std::vector<StringList> results;
        ReadResults("db_names", &results);
        for (size_t i = 0; i != results.size(); ++i) {
            db_names->push_back(results[i][0]);
        }
    }

    void GetTableNames(const std::string& db_name, StringList* tbl_names) {
        std::vector<StringList> results;
        ReadResults("tbl_names", &results);
        for (size_t i = 0; i != results.size(); ++i) {
            tbl_names->push_back(results[i][0]);
        }
    }

    void GetColumns(const std::string& db_name, const std::string& tbl_name,
            StringList* columns, StringList* comment) {
        std::vector<StringList> results;
        ReadResults("cols", &results);
        columns->reserve(results.size());
        comment->reserve(results.size());
        for (size_t i = 0; i != results.size(); ++i) {
            columns->push_back(results[i][0]);
            // std::cout << results[i][0] << std::endl;
            comment->push_back("");//results[i][1]);
        }
    }
};

enum ObjectType {
    kNone = 0,
    kDatabase = 1,
    kTable = 2,
    kColumn = 3
};

struct Database {
    Database(const std::string& name) : name(name) {
    }
    std::string name;
};

struct Table {
    Table(int idx_db, const std::string& name) : db_index(idx_db), name(name) {
    }
    int db_index;
    std::string name;
    std::string comment;
};

struct Column {
    Column(int tb_index, const std::string& name, const std::string& comment) 
        : tbl_index(tb_index), name(name), comment(comment) {
    }
    int tbl_index;
    std::string name;
    std::string comment;
};

struct UniqueId {
    UniqueId(ObjectType type, int index) : type(type), index(index) {
    }

    ObjectType type;
    int index;
};

struct MetaObject {
    UniqueId id;
    std::string name;
    MetaObject(UniqueId id, const std::string& name) : id(id), name(name) {
    }

    bool operator<(const MetaObject& other) const {
        return name < other.name;
    }
};

class MetaCacheService {
    struct Result {
        std::string name;
        std::string value;
        std::string comment;
        int score;
    };

public:
    // select b, z from tables;
    void Init() {
        StringList db_names;
        GetDatabaseNames(&db_names);
        for (size_t i_db = 0; i_db != db_names.size(); ++i_db) {
            m_dbs.push_back(Database(db_names[i_db]));
            m_objs.push_back(MetaObject(
                        UniqueId(kDatabase, i_db),
                        db_names[i_db]));
            StringList tbl_names;
            GetTableNames(db_names[i_db], &tbl_names);
            for (size_t i_tbl = 0; i_tbl != tbl_names.size(); ++i_tbl) {
                LoadTable(db_names[i_db], tbl_names[i_tbl]);
            }
        }
        std::sort(m_objs.begin(), m_objs.end());
    }

    std::string FindIntelligence(const std::string& content, const std::string& line, const std::string& prefix) {
        std::vector<MetaObject>::iterator iter = 
            std::lower_bound(m_objs.begin(), m_objs.end(), 
                    MetaObject(UniqueId(kNone, 0), prefix));
        std::map<std::string, Result> results;
        while (iter != m_objs.end()) {
            const std::string& name = iter->name;
            if (name.size() < prefix.size()) {  // not match
                break;
            }
            bool is_match = true;
            for (size_t i = 0; i < prefix.size(); ++i) {
                if (name[i] != prefix[i]) {
                    is_match = false;
                    break;
                }
            }
            if (!is_match) {
                break;
            }
            Result result;
            ObjectType type = iter->id.type;
            result.comment = GetName(type);
            result.name = iter->name;
            result.value = iter->name;
            result.score = 100;
            results[result.name] = result;
            if (results.size() > 100) {
                break;
            }
            iter++;
        }
        std::stringstream ss;
        ss << "[";
        std::map<std::string, Result>::const_iterator riter = results.begin();
        while (riter != results.end()) {
            const Result& result = riter->second;
            ss << "{";
            ss << "\"word\":\"" << result.name << "\",";
            ss << "\"value\":\"" << result.value << "\",";
            ss << "\"score\":\"" << result.score << "\",";
            ss << "\"meta\":\"" << result.comment << "\"";
            ss << "}";
            if (++riter != results.end()) {
                ss << ",";
            }
        }
        ss << "]";
        return ss.str();
    }

private:
    std::vector<Database> m_dbs;
    std::vector<Table> m_tables;
    std::vector<Column> m_columns;
    std::vector<MetaObject> m_objs;
    MetaStore client;

    void GetDatabaseNames(StringList* db_names) {
        client.GetDatabaseNames(db_names);
    }

    void GetTableNames(const std::string& db_name, StringList* tbl_names) {
        client.GetTableNames(db_name, tbl_names);
    }

    void GetColumns(const std::string& db_name, const std::string& tbl_name,
            StringList* columns, StringList* comment) {
        client.GetColumns(db_name, tbl_name, columns, comment);
    }

    void LoadTable(const std::string& db_name, const std::string& tbl_name) {
        int i_db = static_cast<int>(m_dbs.size()) - 1;
        m_tables.push_back(Table(i_db, tbl_name));

        int i_tbl = static_cast<int>(m_tables.size() - 1);
        m_objs.push_back(MetaObject(
                    UniqueId(kTable, i_tbl),
                    tbl_name));

        StringList cols;
        StringList comments;
        GetColumns(db_name, tbl_name, &cols, &comments);
        for (size_t i_col = 0; i_col != cols.size(); ++i_col) {
            m_columns.push_back(Column(i_tbl, tbl_name, comments[i_col]));
            m_objs.push_back(MetaObject(
                        UniqueId(kColumn, static_cast<int>(m_columns.size())),
                        cols[i_col]));
        }
    }
 
    std::string GetName(ObjectType type) {
        switch (type) {
        case kDatabase:
            return "Database";
        case kTable:
            return "Table";
        case kColumn:
            return "Column";
        }
        return "";
    }
};

inline void to_lower(std::string& prefix) {
    std::transform(prefix.begin(), prefix.end(), prefix.begin(), ::tolower);
}

#if 0
int main(int argc, char* argv[]) {
    MetaCacheService cache_service;
    cache_service.Init();
    if (argc < 2) 
        return 1;
    std::string prefix = std::string(argv[1]);
    to_lower(prefix);
    std::cout << cache_service.FindIntelligence("", "", prefix);
    return 0;
}
#endif
#if 0
struct TrieNode {
public:
    TrieNode() : m_value(-1) {
    }

    ~TrieNode() {
        std::stack<TrieNode*> nodes;
        for (size_t i = 0; i != m_nodes.size(); ++i) {
            if (m_nodes[i] != NULL) {
                nodes.push(node->m_nodes[i]);
                m_nodes[i] = NULL;
            }
        }
        while (!nodes.empty()) {
            TrieNode* node = nodes.pop();
            for (size_t i = 0; i != node->m_nodes.size(); ++i) {
                if (node->m_nodes[i] != NULL) {
                    nodes.push(node->m_nodes[i]);
                    node->m_nodes[i] = NULL;
                }
            }
            delete node;
        }
    }

    TrieNode* GetChild(char ch, bool create_if_not_exists) {
        int idx = -1;
        if (ch >= '0' && ch <= '9') {
            idx = ch - '0';
        } else if (ch >= 'a' && ch <= 'z') {
            idx = ch - 'a' + 10;
        } else if (ch == '_') {
            idx = 36;
        } else {
            // if (ch == '.')
            idx = 37;
        }
        if (m_children[idx] == NULL) {
            m_children[idx] = new TrieNode();
        }
        return m_children[idx];
    }

    void Insert(const UniqueId& id, const std::string& value) {
        const TrieNode* node = this;
        for (size_t i = 0; i != value.size(); ++i) {
            node = node->GetChild(value[i], true);
            node->m_values.push_back(id);
        }
    }

    void Find(const std::string& prefix) {
        const TrieNode* node = this;
        for (size_t i = 0; i != prefix.size(); ++i) {
           node = node->GetChild(prefix[i], false);
           if (node == NULL) {
               break;
           }
        }
        if (node != NULL) {
            std::vector<UniqueId> results;
            results.insert(results.end(), node.m_values.begin(), node.m_values.end());
            for (size_t i = 0; i != node->m_children.size(); ++i) {
            }
        }
    }
private:
    static const int MAX_LEN = 38; // 0-9, a-z, _, .
    std::vector<UniqueId> m_values;
    TrieNode* m_children[MAX_LEN];
};

class Trie {
    TrieNode root;
public:
    void InsertDatabase(int index, const std::string& value) {
        UniqueId id(UniqueId::kDatabase, index);
        root.Insert(id, value);
    }

    void InsertTable(int index, const std::string& value);
    void InsertColumn(int index, const std::string& value);
    TrieNode& FindNode(std::string& prefix);
};
#endif
