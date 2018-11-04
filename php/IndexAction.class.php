 <?php
    public function get_bug_count(){
        if(!isset($_GET['creator'])) exit;
        $condition["creator"] = $_GET['creator'];
        $condition["status"] = 2;
        $total = M("bugs")->where($condition)->count();
        $data['done'] = $total;
        $condition['status'] = 1;
        $condition['level'] = array("gt",0);
        $data['list'] = M("bugs")->where($condition)->group("level")->field("count(*) as count,level")->select();
        return $data;
    }

    public function post_bug(){
        $data = $_POST;
        if(!isset($data['creator'])) exit;
        $data['created_at'] = now();
        return M("bugs")->add($data);
    }

    public function put_bug(){
        $data = $_POST;
        if(!isset($data['id'])) exit;
        return M("bugs")->save($data);
    }
}