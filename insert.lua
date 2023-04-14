if redis.call("llen", "mi_lista") == 0 then
    redis.call("rpush", "mi_lista", "3 LR.CCR.L.RLLLCLR.LL..R...CLR.")
    redis.call("rpush", "mi_lista", "5 RL....C.L")
    redis.call("rpush", "mi_lista", "0")
  end